import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import { File } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: File[],
    @Body() body: UploadFilesDto,
  ) {
    const batchId = await this.uploadService.processUpload(
      files,
      body.targetLangs,
    );

    return { batchId };
  }

  @Get('/status/:uuid')
  async getStatus(@Param('uuid') uuid: string) {
    const result = await this.uploadService.getBatchStatus(uuid);

    if (result.status === 'not_found') {
      return { status: 'not_found', message: 'Batch not found' };
    }

    return result;
  }
}
