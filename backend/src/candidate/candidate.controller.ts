import { Controller, Get, Param, Patch, Body, UseGuards, Post, Req } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from '../audit/audit.service';

@Controller('candidate')
// @UseGuards(JwtAuthGuard) // Disabling for local ease if auth not fully seeded
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  getAll() {
    return this.candidateService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.candidateService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    const userId = req.user?.id || 'system';
    const updated = await this.candidateService.updateStatus(id, status);
    await this.auditService.logAction('STATUS_UPDATE', id, 'Candidate', userId, `Status changed to ${status}`);
    return updated;
  }

  @Post(':id/notes')
  async addNote(@Param('id') id: string, @Body('content') content: string, @Req() req: any) {
    const userId = req.user?.id || 'system';
    const note = await this.candidateService.addNote(id, content, userId);
    await this.auditService.logAction('NOTE_ADDED', id, 'Candidate', userId, `Note added`);
    return note;
  }
}
