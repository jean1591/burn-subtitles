import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation, TranslationStatus } from './entities/translation.entity';

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
}
