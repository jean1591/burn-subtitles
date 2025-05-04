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
    console.log('🚀 ~ processUpload ~ batchId:', batchId);

    const uploadDir = path.join('uploads', batchId, 'original');
    console.log('Creating directory:', uploadDir);
    await fs.mkdir(uploadDir, { recursive: true });
    console.log('Directory created successfully');

    // Save files and create jobs
    const jobs: string[] = [];
    const targetLanguages = targetLangs.split(',');
    console.log('Target languages:', targetLanguages);

    for (const file of files) {
      console.log('Processing file:', file.originalname);
      const sanitizedFilename = sanitizeFilename(file.originalname);
      const filePath = path.join(uploadDir, sanitizedFilename);

      // Save file
      console.log('Writing file to:', filePath);
      await fs.writeFile(filePath, file.buffer);
      console.log('File written successfully');

      // Create jobs for each target language
      for (const targetLang of targetLanguages) {
        console.log('Creating job for language:', targetLang);
        const jobId = uuidv4();
        console.log('Generated jobId:', jobId);

        // Create job metadata
        const jobData = {
          jobId,
          batchId,
          filePath,
          targetLang,
          status: 'queued',
        };

        // Store job in Redis
        console.log('Storing job in Redis:', jobId);
        try {
          await this.redisService.hset(`job:${jobId}`, jobData);
          console.log('Job stored successfully in Redis');
        } catch (error) {
          console.error('Error storing job in Redis:', error);
          throw error;
        }

        console.log('Adding job to batch list in Redis');
        try {
          await this.redisService.rpush(`batch:${batchId}:jobs`, jobId);
          console.log('Job added to batch list successfully');
        } catch (error) {
          console.error('Error adding job to batch list:', error);
          throw error;
        }

        // Enqueue translation job
        console.log('Adding job to translation queue');
        try {
          await this.translationQueue.add('translate', jobData);
          console.log('Job added to queue successfully');
        } catch (error) {
          console.error('Error adding job to queue:', error);
          throw error;
        }

        jobs.push(jobId);
        console.log('Job creation complete for:', jobId);
      }
    }

    console.log('🚀 ~ processUpload ~ jobs:', jobs);

    // Store batch metadata
    console.log('Storing batch metadata in Redis');
    try {
      await this.redisService.hset(`batch:${batchId}`, {
        createdAt: Date.now(),
        targetLangs,
        totalJobs: jobs.length,
      });
      console.log('Batch metadata stored successfully');
    } catch (error) {
      console.error('Error storing batch metadata:', error);
      throw error;
    }

    console.log('Upload processing complete, returning batchId:', batchId);
    return batchId;
  }

  async getBatchStatus(uuid: string) {
    // Fetch batch metadata
    const batch = await this.redisService.hgetall(`batch:${uuid}`);
    if (!batch || Object.keys(batch).length === 0) {
      return { status: 'not_found', message: 'Batch not found' };
    }

    console.log('🚀 ~ getBatchStatus ~ batch:', batch);

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
        fileName: job.filePath ? job.filePath.split('/').pop() : undefined,
        language: job.targetLang,
        status: job.status,
        error: job.error || undefined,
      });
    }

    console.log('🚀 ~ getBatchStatus ~ jobs:', jobs);

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
