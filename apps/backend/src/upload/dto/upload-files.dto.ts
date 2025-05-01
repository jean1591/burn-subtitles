import { IsArray, IsString, Matches } from 'class-validator';

import { File } from 'multer';

export class UploadFilesDto {
  @IsArray()
  files: File[];

  @IsString()
  @Matches(/^[a-z]{2}(,[a-z]{2})*$/, {
    message: 'targetLangs must be comma-separated ISO 639-1 language codes',
  })
  targetLangs: string;
}
