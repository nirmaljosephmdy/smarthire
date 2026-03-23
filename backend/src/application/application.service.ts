import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResumeProcessor } from '../queue/resume.processor';
import { ApplyDto } from './application.controller';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeProcessor: ResumeProcessor
  ) {}

  async processApplication(dto: ApplyDto, file: Express.Multer.File) {
    const refNum = 'SH-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const candidate = await this.prisma.candidate.create({
      data: {
        referenceNumber: refNum,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        role: dto.role,
        resumeUrl: file?.path || 'dummy.pdf', 
        status: 'pending',
      },
    });

    // Synchronous execution for standalone mode
    this.resumeProcessor.process(candidate.id, file?.path || 'dummy.pdf');

    return {
      message: 'Application received successfully',
      referenceNumber: refNum,
    };
  }
}
