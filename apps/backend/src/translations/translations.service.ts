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

  async create(translation: Partial<Translation>): Promise<Translation> {
    const newTranslation = this.translationsRepository.create(translation);
    return this.translationsRepository.save(newTranslation);
  }

  async findByUserId(userId: string): Promise<Translation[]> {
    return this.translationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByBatchId(batchId: string): Promise<Translation[]> {
    return this.translationsRepository.find({
      where: { batchId },
    });
  }

  async updateStatus(
    batchId: string,
    status: TranslationStatus,
  ): Promise<void> {
    await this.translationsRepository.update({ batchId }, { status });
  }

  async getTranslationStats(userId: string): Promise<{
    totalFiles: number;
    totalCreditsUsed: number;
  }> {
    const translations = await this.findByUserId(userId);
    return {
      totalFiles: translations.length,
      totalCreditsUsed: translations.reduce((sum, t) => sum + t.creditsUsed, 0),
    };
  }
}
