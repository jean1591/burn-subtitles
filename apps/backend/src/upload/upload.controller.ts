// Handles file uploads and triggers job creation
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { diskStorage } from "multer";
import type { Multer } from "multer";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("video", {
      storage: diskStorage({
        // We'll handle renaming in the service, so use default tmp name
        destination: "uploads/",
        filename: (req, file, cb) => cb(null, file.originalname),
      }),
      limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
    })
  )
  async uploadVideo(@UploadedFile() file: Multer.File, @Req() req) {
    if (!file) {
      throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
    }
    // Get uuid from form data
    const uuid = req.body?.uuid;
    if (!uuid) {
      throw new HttpException("No uuid provided", HttpStatus.BAD_REQUEST);
    }
    return this.uploadService.handleUpload(file, uuid);
  }
}
