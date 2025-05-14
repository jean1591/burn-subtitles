import { Module } from '@nestjs/common';
import { Translation } from './entities/translation.entity';
import { TranslationsController } from './translations.controller';
import { TranslationsService } from './translations.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Translation])],
  providers: [TranslationsService],
  controllers: [TranslationsController],
  exports: [TranslationsService],
})
export class TranslationsModule {}
