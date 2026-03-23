import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const candidates = await this.prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return candidates.map(c => ({
      ...c,
      skills: JSON.parse(c.skills as string),
      education: JSON.parse(c.education as string),
      jobHistory: JSON.parse(c.jobHistory as string),
      certifications: JSON.parse(c.certifications as string),
      languages: JSON.parse(c.languages as string),
    }));
  }

  async findOne(id: string) {
    const c = await this.prisma.candidate.findUnique({
      where: { id },
      include: { notes: { orderBy: { createdAt: 'desc' } } }
    });
    if (!c) throw new NotFoundException('Candidate not found');
    return {
      ...c,
      skills: JSON.parse(c.skills as string),
      education: JSON.parse(c.education as string),
      jobHistory: JSON.parse(c.jobHistory as string),
      certifications: JSON.parse(c.certifications as string),
      languages: JSON.parse(c.languages as string),
    };
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.candidate.update({
      where: { id },
      data: { status }
    });
  }

  async addNote(candidateId: string, content: string, authorId: string) {
    return this.prisma.candidateNote.create({
      data: {
        content,
        candidateId,
        authorId
      }
    });
  }
}
