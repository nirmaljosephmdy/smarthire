import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import * as path from 'path';

export class ApplyDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('resume', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${randomUUID()}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf|docx)$/)) {
        return cb(new BadRequestException('Only PDF and DOCX files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async apply(@Body() dto: ApplyDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Resume file is required');
    }

    return this.applicationService.processApplication(dto, file);
  }
}
