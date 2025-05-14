import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('translations')
@UseGuards(JwtAuthGuard)
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get('history')
  async getTranslationHistory(@Request() req) {
    return this.translationsService.findByUserId(req.user.id);
  }

  @Get('stats')
  async getTranslationStats(@Request() req) {
    return this.translationsService.getTranslationStats(req.user.id);
  }
}
