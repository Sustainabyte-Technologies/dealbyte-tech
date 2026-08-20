import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateProposalDto, UpdateProposalStatusDto, UpdateProposalDto } from './dto';
import { QuoteStatus } from '../generated/prisma';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async generate(dto: GenerateProposalDto) {
    // Load the quote with its deal
    const quote = await this.prisma.quote.findUnique({
      where: { id: dto.quoteId },
      include: {
        deal: true,
        lineItems: true,
        service: true,
      },
    });

    if (!quote) {
      throw new NotFoundException(`Quote ${dto.quoteId} not found`);
    }

    if (quote.status !== QuoteStatus.APPROVED && quote.status !== QuoteStatus.DRAFT) {
      throw new BadRequestException(
        'Only APPROVED or DRAFT quotes can generate proposals',
      );
    }

    const proposalNumber = dto.proposalNumber || quote.proposalNumber || 'STPL-001';
    const proposalDate = dto.proposalDate ? new Date(dto.proposalDate) : quote.proposalDate || new Date();
    const clientLogo = dto.clientLogo || quote.clientLogo || null;

    const existing = await this.prisma.proposal.findFirst({
      where: { quoteId: dto.quoteId },
    });

    if (existing) {
      await this.prisma.proposal.update({
        where: { id: existing.id },
        data: {
          proposalNumber,
          proposalDate,
          clientLogo,
          ...(dto.templateId ? { templateId: dto.templateId } : {}),
        },
      });
      return this.findOne(existing.id);
    }

    // Create proposal record
    const proposal = await this.prisma.proposal.create({
      data: {
        quoteId: quote.id,
        dealId: quote.dealId,
        proposalNumber,
        proposalDate,
        clientLogo,
        templateId: dto.templateId || null,
        fileUrl: null,
      },
      include: {
        quote: { include: { lineItems: true } },
        deal: { include: { service: true, owner: { select: { id: true, name: true } } } },
      },
    });

    return proposal;
  }

  async findOne(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        quote: {
          include: {
            lineItems: true,
            createdBy: { select: { id: true, name: true, email: true } },
          },
        },
        deal: {
          include: {
            service: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
        template: true,
      },
    });

    if (!proposal) throw new NotFoundException(`Proposal ${id} not found`);
    return proposal;
  }

  async findAll() {
    // Find any quotes that do not have a proposal record yet and create DRAFT proposals for them
    const quotesWithoutProposals = await this.prisma.quote.findMany({
      where: {
        proposals: { none: {} },
      },
      select: { id: true, dealId: true, createdAt: true },
    });

    if (quotesWithoutProposals.length > 0) {
      await this.prisma.proposal.createMany({
        data: quotesWithoutProposals.map((q) => ({
          quoteId: q.id,
          dealId: q.dealId,
          status: 'DRAFT',
          generatedAt: q.createdAt,
        })),
      });
    }

    return this.prisma.proposal.findMany({
      orderBy: { generatedAt: 'desc' },
      include: {
        quote: { select: { id: true, finalQuote: true, status: true } },
        deal: {
          include: {
            service: { select: { id: true, name: true } },
            owner: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async updateStatus(id: string, dto: UpdateProposalStatusDto) {
    const proposal = await this.findOne(id);

    // Validate status transitions: draft → reviewed → sent
    const validTransitions: Record<string, string[]> = {
      DRAFT: ['REVIEWED'],
      REVIEWED: ['SENT'],
      SENT: [],
    };

    const allowed = validTransitions[proposal.status] || [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${proposal.status} to ${dto.status}`,
      );
    }

    const data: Record<string, unknown> = { status: dto.status };
    if (dto.status === 'SENT') {
      data.sentAt = new Date();
    }

    return this.prisma.proposal.update({
      where: { id },
      data,
    });
  }

  async update(id: string, dto: UpdateProposalDto, userId?: string) {
    const proposal = await this.findOne(id);

    // Update proposal record
    await this.prisma.proposal.update({
      where: { id },
      data: {
        ...(dto.proposalNumber ? { proposalNumber: dto.proposalNumber } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.clientLogo !== undefined ? { clientLogo: dto.clientLogo } : {}),
        ...(dto.proposalDate ? { proposalDate: new Date(dto.proposalDate) } : {}),
      },
    });

    // Sync proposalNumber and clientLogo on the Quote model if linked
    if (proposal.quoteId) {
      await this.prisma.quote.update({
        where: { id: proposal.quoteId },
        data: {
          ...(dto.proposalNumber ? { proposalNumber: dto.proposalNumber } : {}),
          ...(dto.clientLogo !== undefined ? { clientLogo: dto.clientLogo } : {}),
          ...(dto.proposalDate ? { proposalDate: new Date(dto.proposalDate) } : {}),
        },
      });
    }

    // Sync clientName on the Deal model if passed
    if (dto.clientName && proposal.dealId) {
      await this.prisma.deal.update({
        where: { id: proposal.dealId },
        data: { clientName: dto.clientName },
      });
    }

    // Record Audit Log for editing Proposal
    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE',
          entityType: 'Proposal',
          entityId: id,
          details: {
            description: `Edited Commercial Proposal ${dto.proposalNumber || proposal.proposalNumber || id} for "${dto.clientName || proposal.deal?.clientName || 'Client'}"`,
            proposalNumber: dto.proposalNumber || proposal.proposalNumber,
            clientName: dto.clientName || proposal.deal?.clientName,
            status: dto.status || proposal.status,
          },
        },
      });
    }

    return this.findOne(id);
  }
}
