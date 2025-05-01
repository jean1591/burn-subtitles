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

        // Create job metadata
        const jobData = {
          jobId,
          batchId,
          filePath,
          targetLang,
          status: 'queued',
        };

        // Store job in Redis
        await this.redisService.hset(`job:${jobId}`, jobData);
        await this.redisService.rpush(`batch:${batchId}:jobs`, jobId);

        // Enqueue translation job
        await this.translationQueue.add('translate', jobData);

        jobs.push(jobId);
      }
    }

    // Store batch metadata
    await this.redisService.hset(`batch:${batchId}`, {
      createdAt: Date.now(),
      targetLangs,
      totalJobs: jobs.length,
    });

    return batchId;
  }
}
