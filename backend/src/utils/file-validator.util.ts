// src/utils/file-validator.util.ts
import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export function validateImageFile(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException('Image file is required');
  }

  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const maxSizeMB = 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const fileExt = extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExt)) {
    throw new BadRequestException(`Only ${allowedExtensions.join(', ')} files are allowed.`);
  }

  if (file.size > maxSizeBytes) {
    throw new BadRequestException(`File size must not exceed ${maxSizeMB} MB.`);
  }
}
