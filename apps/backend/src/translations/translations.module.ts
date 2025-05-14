import { Module } from '@nestjs/common';
import { Translation } from './entities/translation.entity';
import { TranslationsService } from './translations.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Translation])],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
