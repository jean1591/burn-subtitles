import { Injectable } from '@nestjs/common';
import { Translation } from '../translations/entities/translation.entity';
import { TranslationsService } from '../translations/translations.service';

export interface DashboardData {
  translations: Translation[];
  stats: {
    totalFiles: number;
    totalCreditsUsed: number;
  };
}

@Injectable()
export class DashboardService {
  constructor(private readonly translationsService: TranslationsService) {}

  async getDashboardData(userId: string): Promise<DashboardData> {
    const translations =
      await this.translationsService.getTranslationsByUser(userId);
    const stats = await this.translationsService.getTranslationStats(userId);

    return {
      translations,
      stats,
    };
  }
}
