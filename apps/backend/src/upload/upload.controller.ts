import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import { File } from 'multer';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedError } from '../errors/unauthaurized.error';

@Controller('upload')
export class UploadController {
  private readonly MAX_FILES = 10;

  constructor(
    private readonly uploadService: UploadService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: File[],
    @Body() body: UploadFilesDto,
    @Request() req,
  ) {
    // Validate input
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (files.length > this.MAX_FILES) {
      throw new BadRequestException(`Maximum ${this.MAX_FILES} files allowed`);
    }

    // Check if user is authenticated
    const isAuthenticated = req.user?.sub;
    const isUnauthenticated = isAuthenticated === undefined;
    const targetLanguages = body.targetLangs.split(',');

    // For unauthenticated users, enforce single file and language limit
    if (isUnauthenticated && files.length > 1) {
      throw new UnauthorizedError('Please log in to upload multiple files');
    }

    if (isUnauthenticated && targetLanguages.length > 1) {
      throw new UnauthorizedError(
        'Please log in to translate to multiple languages',
      );
    }

    const user = isAuthenticated
      ? await this.authService.validateUser(req.user.sub)
      : null;

    if (user) {
      // For authenticated users, check credit balance
      const requiredCredits = files.length * targetLanguages.length;

      // If user has no credits, enforce single file and language limit
      const hasNoCredits = user.credits === 0;
      if (hasNoCredits && files.length > 1) {
        throw new UnauthorizedError(
          'Please add credits to upload multiple files',
        );
      }

      if (hasNoCredits && targetLanguages.length > 1) {
        throw new UnauthorizedError(
          'Please add credits to translate to multiple languages',
        );
      }

      const hasInsufficientCredits = user.credits < requiredCredits;
      if (!hasNoCredits && hasInsufficientCredits) {
        throw new UnauthorizedError(
          `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`,
        );
      }
    }

    const batchId = await this.uploadService.processUpload(
      files,
      body.targetLangs,
      user,
    );

    return {
      status: 'success',
      batchId,
    };
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
