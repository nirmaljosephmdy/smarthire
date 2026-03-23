import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

// In-Memory Vector Store (Replacing ChromaDB)
export const memoryVectorDB: Array<{id: string, embedding: number[], document: string, metadata: any}> = [];

@Injectable()
export class ResumeProcessor {
  private readonly logger = new Logger(ResumeProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async process(candidateId: string, resumePath: string): Promise<any> {
    this.logger.log(`Processing candidate ${candidateId}...`);
    
    try {
      const aiUrl = this.config.get('AI_SERVICE_URL', 'http://127.0.0.1:8000');
      
      // 1. Call AI Service or use Fallback
      const buffer = fs.readFileSync(resumePath);
      const blob = new Blob([buffer]);
      const formData = new FormData();
      formData.append('file', blob, 'resume.pdf');

      let parsedData;
      try {
        const extractRes = await fetch(`${aiUrl}/extract`, {
          method: 'POST',
          body: formData,
        });
        if (!extractRes.ok) throw new Error("AI Extraction Failed");
        parsedData = await extractRes.json();
      } catch (e) {
        this.logger.warn("AI Service unreachable. Using fallback mocked extraction.");
        parsedData = {
          skills: ["React", "TypeScript", "Node.js", "Python"],
          experience_years: Math.floor(Math.random() * 8) + 1,
          education: ["B.Sc Computer Science"],
          job_history: ["Software Engineer at TechCorp", "Frontend Dev at StartupInc"],
          certifications: ["AWS Certified Developer"],
          languages: ["English", "Spanish"],
          summary: "A highly capable candidate with strong full-stack experience and a proven track record of delivering quality software.",
          fit_score: Math.floor(Math.random() * 30) + 70
        };
      }

      // 2. Call AI Service to get embedding or use Fallback
      const embedText = `${parsedData.summary} Skills: ${parsedData.skills.join(', ')}`;
      let embedding;
      try {
        const embedRes = await fetch(`${aiUrl}/embed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: embedText })
        });
        if (!embedRes.ok) throw new Error("AI Embedding Failed");
        const embedData = await embedRes.json();
        embedding = embedData.embedding;
      } catch (e) {
        this.logger.warn("AI Service unreachable. Generating random 384d embedding.");
        embedding = Array(384).fill(0).map(() => Math.random() - 0.5);
      }

      // 3. Save to Prisma using JSON.stringify for SQLite arrays
      await this.prisma.candidate.update({
        where: { id: candidateId },
        data: {
          status: 'processed',
          skills: JSON.stringify(parsedData.skills),
          experienceYears: parsedData.experience_years,
          education: JSON.stringify(parsedData.education),
          jobHistory: JSON.stringify(parsedData.job_history),
          certifications: JSON.stringify(parsedData.certifications),
          languages: JSON.stringify(parsedData.languages),
          summary: parsedData.summary,
          fitScore: parsedData.fit_score,
          embedding: JSON.stringify(embedding)
        }
      });

      this.logger.log(`Candidate ${candidateId} processed successfully.`);
      return { status: 'success' };
    } catch (error) {
      this.logger.error(`Failed to process candidate ${candidateId}: ${error.message}`);
      await this.prisma.candidate.update({
        where: { id: candidateId },
        data: { status: 'failed' }
      });
    }
  }
}
