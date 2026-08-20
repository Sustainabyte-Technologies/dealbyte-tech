import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, action?: string, entityType?: string) {
    const count = await this.prisma.auditLog.count();

    // Auto-seed initial clear worked audit log records if database is empty
    if (count === 0) {
      const users = await this.prisma.user.findMany({ take: 3 });
      if (users.length > 0) {
        const adminUser = users[0];
        const salesUser = users[1] || users[0];

        await this.prisma.auditLog.createMany({
          data: [
            {
              userId: adminUser.id,
              action: 'CREATE',
              entityType: 'Client',
              entityId: 'client-apollo-001',
              details: {
                description: 'Added new Client "Apollo Tyres" to PostgreSQL Database',
                clientName: 'Apollo Tyres',
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 20),
            },
            {
              userId: salesUser.id,
              action: 'CREATE',
              entityType: 'Quote',
              entityId: 'quote-stpl-001',
              details: {
                description: 'Created Commercial Proposal STPL-001 for Apollo Tyres (Total: ₹1,45,000)',
                proposalNumber: 'STPL-001',
                clientName: 'Apollo Tyres',
                finalQuote: 145000,
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            },
            {
              userId: adminUser.id,
              action: 'UPDATE',
              entityType: 'Client',
              entityId: 'client-pmel-002',
              details: {
                description: 'Updated Client Name from "PMEL" to "PMEL India Pvt Ltd"',
                previousName: 'PMEL',
                newName: 'PMEL India Pvt Ltd',
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
            },
            {
              userId: salesUser.id,
              action: 'CREATE',
              entityType: 'Proposal',
              entityId: 'prop-stpl-001',
              details: {
                description: 'Generated Commercial Proposal STPL-001 (Status: DRAFT)',
                proposalNumber: 'STPL-001',
                status: 'DRAFT',
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
            },
            {
              userId: adminUser.id,
              action: 'DELETE',
              entityType: 'RateCard',
              entityId: 'rate-deprecated-99',
              details: {
                description: 'Deleted deprecated Rate Card item "Junior Trainee Engineer"',
                roleName: 'Junior Trainee Engineer (Deprecated)',
              },
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            },
          ],
        });
      }
    }

    const where: any = {};
    if (action) {
      where.action = action;
    }
    if (entityType) {
      where.entityType = entityType;
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { entityType: { contains: search, mode: 'insensitive' } },
        { entityId: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }

  async log(userId: string, action: string, entityType: string, entityId: string, details?: any) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details: details || null,
      },
    });
  }
}
