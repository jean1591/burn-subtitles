import * as fs from 'fs/promises';
import * as path from 'path';

import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { Job } from 'bull';
import { OpenAI } from 'openai';
import { RedisService } from '../redis/redis.service';
import { StatusGateway } from '../gateway/status.gateway';
import { JobStatus, ZipStatus } from '../constants/process-status';

interface TranslationJob {
  jobId: string;
  batchId: string;
  filePath: string;
  targetLang: string;
  status: string;
  outputPath: string;
}

@Processor('translation')
export class TranslationProcessor {
  private readonly openai: OpenAI;
  private readonly testMode: boolean;

  constructor(
    private readonly redisService: RedisService,
    @InjectQueue('zip') private readonly zipQueue: Queue,
    private readonly statusGateway: StatusGateway,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.testMode = process.env.TEST_MODE === 'true';
  }

  @Process('translate')
  async handleTranslation(job: Job<TranslationJob>) {
    const { jobId, batchId, filePath, targetLang, outputPath } = job.data;

    // Test mode logic to simulate job statuses
    if (this.testMode) {
      console.warn('Test mode is enabled');
      const handled = await this.handleTestMode(job);

      if (handled) {
        return;
      }
    }

    try {
      // Update job status to in_progress
      await this.redisService.hset(`job:${jobId}`, {
        status: JobStatus.IN_PROGRESS,
      });

      // Check if output file already exists
      const originalFilename = path.basename(filePath);
      const filenameNoExt = path.parse(originalFilename).name;

      try {
        await fs.access(outputPath);
        // File exists, check if it's valid
        const stats = await fs.stat(outputPath);
        if (stats.size > 0) {
          // File exists and has content, skip translation
          await this.redisService.hset(`job:${jobId}`, {
            status: JobStatus.DONE,
          });
          this.statusGateway.emitJobDone(
            batchId,
            jobId,
            filenameNoExt,
            targetLang,
          );
          await this.checkAndQueueZipJob(batchId);
          return;
        }
      } catch (error) {
        // File doesn't exist, proceed with translation
      }

      // Read the original SRT file
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      // Detect source language if not provided
      const sourceLang = await this.detectLanguage(lines);

      // Translate the content
      const translatedContent = await this.translateSrt({
        lines,
        sourceLang,
        targetLang,
        batchId,
        filePath,
      });

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Write translated file
      await fs.writeFile(outputPath, translatedContent);

      // Update job status to done
      await this.redisService.hset(`job:${jobId}`, {
        status: JobStatus.DONE,
      });
      this.statusGateway.emitJobDone(batchId, jobId, filenameNoExt, targetLang);

      // Check if all jobs are done and queue zip job if needed
      await this.checkAndQueueZipJob(batchId);
    } catch (error) {
      // Update job status to error
      await this.redisService.hset(`job:${jobId}`, {
        status: JobStatus.ERROR,
        error: error.message,
      });
      throw error;
    }
  }

  private async detectLanguage(lines: string[]): Promise<string> {
    // Extract text content from SRT file (skip timestamps and numbers)
    // TODO: textContent can be very large, make sure to only send a subset
    const textContent = lines
      .filter(
        (line) =>
          !/^\d+$/.test(line) &&
          !/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(line),
      )
      .join(' ')
      .trim();

    if (!textContent) {
      throw new Error('No text content found in SRT file');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Detect the language of the following text and respond with only the ISO 639-1 language code:',
        },
        {
          role: 'user',
          content: textContent,
        },
      ],
      temperature: 0,
    });

    return response.choices[0].message.content.trim();
  }

  private async translateSrt({
    lines,
    sourceLang,
    targetLang,
    batchId,
    filePath,
  }: {
    lines: string[];
    sourceLang: string;
    targetLang: string;
    batchId: string;
    filePath: string;
  }): Promise<string> {
    const translatedLines: string[] = [];
    const blocks: { lines: string[]; originalLines: string[] }[] = [];
    let currentBlock: string[] = [];
    let currentOriginalLines: string[] = [];
    let isInBlock = false;

    // First pass: collect all blocks
    for (const line of lines) {
      if (/^\d+$/.test(line)) {
        if (isInBlock && currentBlock.length > 0) {
          blocks.push({
            lines: currentBlock,
            originalLines: currentOriginalLines,
          });
          currentBlock = [];
          currentOriginalLines = [];
        }
        currentOriginalLines.push(line);
        isInBlock = true;
      } else if (
        /^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(line)
      ) {
        currentOriginalLines.push(line);
      } else if (line.trim() === '') {
        if (currentBlock.length > 0) {
          blocks.push({
            lines: currentBlock,
            originalLines: currentOriginalLines,
          });
          currentBlock = [];
          currentOriginalLines = [];
        }
        currentOriginalLines.push(line);
        isInBlock = false;
      } else {
        currentBlock.push(line);
        currentOriginalLines.push(line);
      }
    }

    // Handle any remaining block
    if (currentBlock.length > 0) {
      blocks.push({ lines: currentBlock, originalLines: currentOriginalLines });
    }

    // Batch translation
    const BATCH_SIZE = 10; // Adjust based on average block size and token limits
    for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
      const batch = blocks.slice(i, i + BATCH_SIZE);
      const textsToTranslate = batch.map((b) => b.lines.join(' '));
      const translatedTexts = await this.translateTextBatch(
        textsToTranslate,
        sourceLang,
        targetLang,
      );

      if (translatedTexts.length !== batch.length) {
        console.error(
          `Mismatch: expected ${batch.length} translations, got ${translatedTexts.length}.`,
        );
      }

      // Reconstruct the SRT file
      for (let j = 0; j < batch.length; j++) {
        const block = batch[j];
        const translatedText = translatedTexts[j];
        if (typeof translatedText !== 'string') {
          // Log error and fallback to original text
          console.error(
            `Missing translation for block ${j} in batch (batchId: ${batchId}, file: ${filePath}). Using original text.`,
          );
          translatedLines.push(...block.lines);
        } else {
          const translatedTextLines = translatedText.split('\n');
          const translatedBlock: string[] = [];
          let textLineIndex = 0;
          for (const line of block.originalLines) {
            if (block.lines.includes(line)) {
              if (textLineIndex < translatedTextLines.length) {
                translatedBlock.push(translatedTextLines[textLineIndex]);
                textLineIndex++;
              }
            } else {
              translatedBlock.push(line);
            }
          }
          translatedLines.push(...translatedBlock);
        }
      }
    }

    return translatedLines.join('\n');
  }

  private async translateTextBatch(
    texts: string[],
    sourceLang: string,
    targetLang: string,
  ): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Translate the following texts from ${sourceLang} to ${targetLang}. 
          Each text is a subtitle block. Preserve formatting, line breaks, and special characters.
          Return the translations in the same order, separated by "|||".`,
        },
        {
          role: 'user',
          content: texts.join('|||'),
        },
      ],
      temperature: 0,
    });

    return response.choices[0].message.content.split('|||');
  }

  private async checkAndQueueZipJob(batchId: string): Promise<void> {
    // Get all jobs for this batch
    const jobIds = await this.redisService.lrange(
      `batch:${batchId}:jobs`,
      0,
      -1,
    );

    // Check if all jobs are done
    let allDone = true;
    for (const jobId of jobIds) {
      const job = await this.redisService.hgetall(`job:${jobId}`);
      if (job.status !== JobStatus.DONE) {
        allDone = false;
        break;
      }
    }

    if (allDone) {
      // Emit batch complete event
      this.statusGateway.emitBatchComplete(batchId);

      // Queue zip job
      await this.redisService.hset(`batch:${batchId}`, {
        zipStatus: ZipStatus.QUEUED,
      });
      await this.zipQueue.add({ batch_id: batchId });
    }
  }

  /**
   * Handles test mode simulation of translation jobs.
   * Maps target languages to specific statuses:
   * - 'fr' (French): Sets status to 'queued'
   * - 'es' (Spanish): Sets status to 'in_progress'
   * - 'de' (German): Sets status to 'done' with a dummy output path
   * - 'it' (Italian): Sets status to 'error' with test error message
   * - Any other language: Proceeds with normal processing
   *
   * @param job - The translation job to process
   * @returns Promise<boolean> - True if job was handled in test mode, false if normal processing should continue
   */
  private async handleTestMode(job: Job<TranslationJob>): Promise<boolean> {
    const { jobId, batchId, filePath, targetLang } = job.data;
    const originalFilename = path.basename(filePath);
    const filenameNoExt = path.parse(originalFilename).name;

    // Simulate different job statuses based on target language
    switch (targetLang) {
      case 'fr':
        await this.redisService.hset(`job:${jobId}`, {
          status: JobStatus.QUEUED,
        });
        break;
      case 'es':
        await this.redisService.hset(`job:${jobId}`, {
          status: JobStatus.IN_PROGRESS,
        });
        break;
      case 'de':
        await this.redisService.hset(`job:${jobId}`, {
          status: JobStatus.DONE,
        });
        this.statusGateway.emitJobDone(
          batchId,
          jobId,
          filenameNoExt,
          targetLang,
        );
        await this.checkAndQueueZipJob(batchId);
        break;
      case 'it':
        await this.redisService.hset(`job:${jobId}`, {
          status: JobStatus.ERROR,
          error: 'Test mode simulated error',
        });
        break;
      default:
        // For any other language, proceed with normal processing
        return false;
    }

    // Return true if we handled the job in test mode
    return ['fr', 'es', 'de', 'it'].includes(targetLang);
  }
}
