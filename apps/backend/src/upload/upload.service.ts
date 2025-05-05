import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { sanitizeFilename } from '../utils/filename.util';
import { File } from 'multer';

@Injectable()
export class UploadService {
  private readonly MAX_FILES = 10;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(
    @InjectQueue('translation') private translationQueue: Queue,
    private readonly redisService: RedisService,
  ) {}

  async processUpload(files: File[], targetLangs: string): Promise<string> {
    // Validate input
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (files.length > this.MAX_FILES) {
      throw new BadRequestException(`Maximum ${this.MAX_FILES} files allowed`);
    }

    // Validate file types and sizes
    const filenames = new Set<string>();
    for (const file of files) {
      if (path.extname(file.originalname).toLowerCase() !== '.srt') {
        throw new BadRequestException('Only .srt files are allowed');
      }

      if (file.size > this.MAX_FILE_SIZE) {
        throw new BadRequestException('File size exceeds 5MB limit');
      }

      if (filenames.has(file.originalname)) {
        throw new BadRequestException('Duplicate filenames are not allowed');
      }

      filenames.add(file.originalname);
    }

    // Generate batch ID and create directory
    const batchId = uuidv4();

    const uploadDir = path.join('uploads', batchId, 'original');
    await fs.mkdir(uploadDir, { recursive: true });

    // Save files and create jobs
    const jobs: string[] = [];
    const targetLanguages = targetLangs.split(',');

    for (const file of files) {
      const sanitizedFilename = sanitizeFilename(file.originalname);
      const filePath = path.join(uploadDir, sanitizedFilename);

      // Save file
      await fs.writeFile(filePath, file.buffer);

      // Create jobs for each target language
      for (const targetLang of targetLanguages) {
        const jobId = uuidv4();

        // Calculate output path in advance
        const filenameNoExt = path.parse(sanitizedFilename).name;
        const outputDir = path.join('uploads', batchId, filenameNoExt);
        const outputFilename = `${filenameNoExt}.${targetLang}.srt`;
        const outputPath = path.join(outputDir, outputFilename);

        // Create job metadata
        const jobData = {
          jobId,
          batchId,
          filePath,
          targetLang,
          status: 'queued',
          outputPath,
        };

        // Store job in Redis
        try {
          await this.redisService.hset(`job:${jobId}`, jobData);
        } catch (error) {
          console.error('Error storing job in Redis:', error);
          throw error;
        }

        try {
          await this.redisService.rpush(`batch:${batchId}:jobs`, jobId);
        } catch (error) {
          console.error('Error adding job to batch list:', error);
          throw error;
        }

        // Enqueue translation job
        try {
          await this.translationQueue.add('translate', jobData);
        } catch (error) {
          console.error('Error adding job to queue:', error);
          throw error;
        }

        jobs.push(jobId);
      }
    }

    // Store batch metadata
    try {
      await this.redisService.hset(`batch:${batchId}`, {
        createdAt: Date.now(),
        targetLangs,
        totalJobs: jobs.length,
      });
    } catch (error) {
      console.error('Error storing batch metadata:', error);
      throw error;
    }

    return batchId;
  }

  async getBatchStatus(uuid: string) {
    // Fetch batch metadata
    const batch = await this.redisService.hgetall(`batch:${uuid}`);
    if (!batch || Object.keys(batch).length === 0) {
      return { status: 'not_found', message: 'Batch not found' };
    }

    // Fetch all job IDs for this batch
    const jobIds = await this.redisService.lrange(`batch:${uuid}:jobs`, 0, -1);
    const jobs = [];

    let allDone = true;
    let anyError = false;

    for (const jobId of jobIds) {
      const job = await this.redisService.hgetall(`job:${jobId}`);

      if (job.status !== 'done') {
        allDone = false;
      }
      if (job.status === 'error') {
        anyError = true;
      }

      jobs.push({
        jobId: job.jobId,
        fileName: job.outputPath ? job.outputPath.split('/').pop() : undefined,
        language: job.targetLang,
        status: job.status,
        error: job.error || undefined,
      });
    }

    // Determine overall status
    let status = 'processing_started';
    if (anyError) {
      status = 'processing_failed';
    } else if (allDone) {
      status = 'processing_completed';
    } else if (jobs.every((j) => j.status === 'queued')) {
      status = 'queue';
    }

    // Check zip status and URL
    let zipReady = false;
    let zipUrl = null;

    if (batch.zipStatus === 'queued' || batch.zipStatus === 'done') {
      const zipPath = path.join('uploads', uuid, 'results.zip');

      if (
        await fs
          .stat(zipPath)
          .then(() => true)
          .catch(() => false)
      ) {
        zipReady = true;
        zipUrl = `/uploads/${uuid}/results.zip`;
      }
    }

    return {
      status,
      jobs,
      zipReady,
      zipUrl,
      createdAt: batch.createdAt ? Number(batch.createdAt) : undefined,
      targetLangs: batch.targetLangs,
      totalJobs: batch.totalJobs ? Number(batch.totalJobs) : jobs.length,
      failedReason: anyError
        ? jobs.find((j) => j.status === 'error')?.error
        : undefined,
    };
  }
}
