import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { sanitizeFilename } from '../utils/filename.util';
import { File } from 'multer';
import {
  JobStatus,
  ProcessStatus,
  ZipStatus,
} from '../constants/process-status';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UploadService {
  private readonly MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  constructor(
    @InjectQueue('translation') private translationQueue: Queue,
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async processUpload(
    files: File[],
    targetLangs: string,
    user: User | null,
  ): Promise<string> {
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
          status: JobStatus.QUEUED,
          outputPath,
          userId: user?.id,
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
        userId: user?.id,
      });
    } catch (error) {
      console.error('Error storing batch metadata:', error);
      throw error;
    }

    // If user is authenticated, deduct credits after all jobs are queued
    if (user && user.credits > 0) {
      const requiredCredits = files.length * targetLanguages.length;
      await this.usersRepository.decrement(
        { id: user.id },
        'credits',
        requiredCredits,
      );
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
    let anyInProgress = false;

    for (const jobId of jobIds) {
      const job = await this.redisService.hgetall(`job:${jobId}`);

      if (job.status !== JobStatus.DONE) {
        allDone = false;
      }
      if (job.status === JobStatus.ERROR) {
        anyError = true;
      }
      if (job.status === JobStatus.IN_PROGRESS) {
        anyInProgress = true;
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
    let status = ProcessStatus.PROCESSING_STARTED;
    if (anyError) {
      status = ProcessStatus.PROCESSING_FAILED;
    } else if (allDone) {
      status = ProcessStatus.PROCESSING_COMPLETED;
    } else if (anyInProgress) {
      status = ProcessStatus.PROCESSING_STARTED;
    } else if (jobs.every((j) => j.status === JobStatus.QUEUED)) {
      status = ProcessStatus.QUEUE;
    }

    // Check zip status and URL
    let zipReady = false;
    let zipUrl = null;

    if (
      batch.zipStatus === ZipStatus.QUEUED ||
      batch.zipStatus === ZipStatus.DONE
    ) {
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
        ? jobs.find((j) => j.status === JobStatus.ERROR)?.error
        : undefined,
    };
  }
}
