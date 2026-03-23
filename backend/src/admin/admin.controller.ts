import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
// @UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const totalApplications = await this.prisma.candidate.count();
    const pending = await this.prisma.candidate.count({ where: { status: 'pending' } });
    const processed = await this.prisma.candidate.count({ where: { status: 'processed' } });
    const failed = await this.prisma.candidate.count({ where: { status: 'failed' } });
    
    // Averages/aggregates
    const hires = await this.prisma.candidate.count({ where: { status: 'hired' } });

    return {
      totalApplications,
      pending,
      processed,
      failed,
      hires
    };
  }
}
