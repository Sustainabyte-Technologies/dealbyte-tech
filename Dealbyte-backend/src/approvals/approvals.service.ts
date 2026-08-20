import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApproveRejectDto } from './dto';
import { ApprovalStatus, QuoteStatus } from '../generated/prisma';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async findPending(approverId?: string) {
    const where: Record<string, unknown> = {
      status: ApprovalStatus.PENDING,
    };
    if (approverId) {
      where.approverId = approverId;
    }

    return this.prisma.approvalRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        quote: {
          include: {
            deal: { include: { service: true } },
            createdBy: { select: { id: true, name: true, email: true } },
          },
        },
        requestedBy: { select: { id: true, name: true, email: true } },
        approver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async approve(id: string, dto: ApproveRejectDto, approverId: string) {
    const request = await this.findRequest(id);

    if (request.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('This request has already been decided');
    }

    await this.prisma.$transaction(async (tx) => {
      // Update approval request
      await tx.approvalRequest.update({
        where: { id },
        data: {
          status: ApprovalStatus.APPROVED,
          reason: dto.reason || 'Approved',
          decidedAt: new Date(),
        },
      });

      // Update quote status
      await tx.quote.update({
        where: { id: request.quoteId },
        data: { status: QuoteStatus.APPROVED },
      });
    });

    // TODO: Send email notification via MailService
    return { message: 'Quote approved successfully' };
  }

  async reject(id: string, dto: ApproveRejectDto, approverId: string) {
    const request = await this.findRequest(id);

    if (request.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('This request has already been decided');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.approvalRequest.update({
        where: { id },
        data: {
          status: ApprovalStatus.REJECTED,
          reason: dto.reason || 'Rejected',
          decidedAt: new Date(),
        },
      });

      await tx.quote.update({
        where: { id: request.quoteId },
        data: { status: QuoteStatus.REJECTED },
      });
    });

    // TODO: Send email notification via MailService
    return { message: 'Quote rejected' };
  }

  private async findRequest(id: string) {
    const request = await this.prisma.approvalRequest.findUnique({
      where: { id },
      include: { quote: true },
    });
    if (!request) {
      throw new NotFoundException(`Approval request ${id} not found`);
    }
    return request;
  }
}
