import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/translation.entity';
import { TranslationStatus } from './entities/translation.entity';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation)
    private translationsRepository: Repository<Translation>,
  ) {}

  async createTranslation(
    batchId: string,
    fileName: string,
    selectedLanguages: string,
    creditsUsed: number,
    userId: string,
  ): Promise<Translation> {
    const newTranslation = this.translationsRepository.create({
      batchId,
      fileName,
      selectedLanguages,
      creditsUsed,
      userId,
      status: TranslationStatus.QUEUED,
      deletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    return this.translationsRepository.save(newTranslation);
  }

  async updateStatusByBatchId(
    batchId: string,
    status: TranslationStatus,
  ): Promise<void> {
    await this.translationsRepository.update({ batchId }, { status });
  }

  async getTranslationsByUser(userId: string): Promise<Translation[]> {
    return this.translationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTranslationStats(userId: string): Promise<{
    totalFiles: number;
    totalCreditsUsed: number;
  }> {
    const stats = await this.translationsRepository
      .createQueryBuilder('translation')
      .select('COUNT(*)', 'totalFiles')
      .addSelect('SUM(translation.creditsUsed)', 'totalCreditsUsed')
      .where('translation.userId = :userId', { userId })
      .getRawOne();

    return {
      totalFiles: Number(stats.totalFiles) || 0,
      totalCreditsUsed: Number(stats.totalCreditsUsed) || 0,
    };
  }

  async getExpiredBatches(): Promise<string[]> {
    const result = await this.translationsRepository
      .createQueryBuilder('translation')
      .select('DISTINCT translation.batchId')
      .where('translation.deletionDate <= :now', { now: new Date() })
      .andWhere('translation.isDeleted = :isDeleted', { isDeleted: false })
      .getRawMany();

    return result.map((r) => r.batch_id);
  }

  async markAsDeleted(batchId: string): Promise<void> {
    await this.translationsRepository.update({ batchId }, { isDeleted: true });
  }
}
