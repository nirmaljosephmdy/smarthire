import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(action: string, entityId?: string, entityType?: string, userId?: string, details?: string) {
    return this.prisma.auditLog.create({
      data: {
        action,
        entityId,
        entityType,
        userId,
        details
      }
    });
  }

  async getLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
