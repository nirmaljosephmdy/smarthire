import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { memoryVectorDB } from '../queue/resume.processor';
import { AuditService } from '../audit/audit.service';

export interface SearchFilters {
  role?: string;
  minExperience?: number;
  minFitScore?: number;
}

// Simple Cosine Similarity
function cosineSimilarity(vecA: number[], vecB: number[]) {
  if (!vecA || !vecB || !Array.isArray(vecA) || !Array.isArray(vecB)) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    const a = vecA[i] || 0;
    const b = vecB[i] || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly audit: AuditService
  ) {}

  async semanticSearch(query: string, filters?: SearchFilters, userId?: string) {
    try {
      await this.audit.logAction('SEMANTIC_SEARCH', undefined, undefined, userId, `Queried: ${query}`);

      const aiUrl = this.config.get('AI_SERVICE_URL', 'http://127.0.0.1:8000');
      let queryEmbedding;
      try {
        const embedRes = await fetch(`${aiUrl}/embed`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ text: query })
        });
        if(!embedRes.ok) throw new Error("AI Embedding Failed");
        const embedData = await embedRes.json();
        queryEmbedding = embedData.embedding;
      } catch (e) {
        this.logger.warn("AI Service unreachable. Falling back to random search embedding.");
        queryEmbedding = Array(384).fill(0).map(() => Math.random() - 0.5);
      }

      // Fetch all processed candidates from database
      const allCandidates = await this.prisma.candidate.findMany({
        where: { status: 'processed' }
      });

      if (allCandidates.length === 0) return { count: 0, results: [] };

      // Parse JSON arrays and calculate similarity
      let candidates = allCandidates.map(c => {
        const parsed = {
          ...c,
          skills: JSON.parse(c.skills as string),
          education: JSON.parse(c.education as string),
          jobHistory: JSON.parse(c.jobHistory as string),
          certifications: JSON.parse(c.certifications as string),
          languages: JSON.parse(c.languages as string),
          // Fallback array if embedding is null
          embedding: c.embedding ? JSON.parse(c.embedding as string) : Array(384).fill(0)
        };
        
        const semanticScore = cosineSimilarity(queryEmbedding, parsed.embedding);
        
        return {
          ...parsed,
          score: semanticScore,
          // Overwrite the static database fitScore with the dynamic relevance score for UI
          fitScore: Math.max(0, Math.min(100, Math.round(semanticScore * 100)))
        };
      });

      // Filter by top 50 semantic matches first
      candidates.sort((a, b) => b.score - a.score);
      candidates = candidates.slice(0, 50);

      // Apply explicit filters
      if (filters) {
        const { role, minExperience, minFitScore } = filters;
        if (role) candidates = candidates.filter(c => c.role.toLowerCase() === role.toLowerCase());
        if (minExperience !== undefined) candidates = candidates.filter(c => c.experienceYears >= minExperience);
        if (minFitScore !== undefined) candidates = candidates.filter(c => c.fitScore >= minFitScore);
      }

      // Apply implicit heuristic filters from the semantic query (e.g., "15+ years" or "8+ experienced")
      const expMatch = query.match(/(\d+)\+?\s*(?:years?|yrs?|experience|experienced)/i);
      if (expMatch) {
        const reqExp = parseInt(expMatch[1], 10);
        candidates = candidates.filter(c => c.experienceYears >= reqExp);
      }

      // Sort by the dynamic semantic fitScore descending for UI presentation
      candidates.sort((a, b) => b.fitScore - a.fitScore);

      return {
        count: candidates.length,
        results: candidates
      };
    } catch (e) {
      this.logger.error('Search failed: ' + e.message);
      throw e;
    }
  }
}
