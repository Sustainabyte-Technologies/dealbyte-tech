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

    const clientRecord = quote.deal?.clientName
      ? await this.prisma.client.findFirst({
          where: { name: { equals: quote.deal.clientName, mode: 'insensitive' } },
        }).catch(() => null)
      : null;

    const clientLogo = dto.clientLogo || quote.clientLogo || quote.deal?.clientLogo || clientRecord?.logo || null;
    const customContent = dto.customContent !== undefined ? dto.customContent : quote.customContent;
    const scopeDetails = dto.scopeDetails !== undefined ? dto.scopeDetails : quote.scopeDetails;

    if (clientLogo) {
      if (!quote.clientLogo) {
        await this.prisma.quote.update({ where: { id: quote.id }, data: { clientLogo } }).catch(() => {});
      }
      if (quote.deal && !quote.deal.clientLogo) {
        await this.prisma.deal.update({ where: { id: quote.deal.id }, data: { clientLogo } }).catch(() => {});
      }
    }

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
          customContent,
          scopeDetails,
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
        customContent,
        scopeDetails,
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

    if (!proposal.clientLogo && proposal.deal?.clientName) {
      const clientRecord = await this.prisma.client.findFirst({
        where: { name: { equals: proposal.deal.clientName, mode: 'insensitive' } },
      }).catch(() => null);
      if (clientRecord?.logo) {
        proposal.clientLogo = clientRecord.logo;
      }
    }

    return proposal;
  }

  async findAll() {
    // Find any quotes that do not have a proposal record yet and create DRAFT proposals for them
    const quotesWithoutProposals = await this.prisma.quote.findMany({
      where: {
        proposals: { none: {} },
      },
      select: { id: true, dealId: true, createdAt: true, customContent: true, scopeDetails: true },
    });

    if (quotesWithoutProposals.length > 0) {
      await this.prisma.proposal.createMany({
        data: quotesWithoutProposals.map((q) => ({
          quoteId: q.id,
          dealId: q.dealId,
          status: 'DRAFT',
          customContent: q.customContent ? (q.customContent as any) : undefined,
          scopeDetails: q.scopeDetails || undefined,
          generatedAt: q.createdAt,
        })),
      });
    }

    return this.prisma.proposal.findMany({
      orderBy: { generatedAt: 'desc' },
      include: {
        quote: {
          select: {
            id: true,
            finalQuote: true,
            status: true,
            customContent: true,
            scopeDetails: true,
            service: { select: { id: true, name: true } },
          },
        },
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
        ...(dto.customContent !== undefined ? { customContent: dto.customContent } : {}),
        ...(dto.scopeDetails !== undefined ? { scopeDetails: dto.scopeDetails } : {}),
      },
    });

    // Sync proposalNumber, clientLogo, customContent, scopeDetails on the Quote model if linked
    if (proposal.quoteId) {
      await this.prisma.quote.update({
        where: { id: proposal.quoteId },
        data: {
          ...(dto.proposalNumber ? { proposalNumber: dto.proposalNumber } : {}),
          ...(dto.clientLogo !== undefined ? { clientLogo: dto.clientLogo } : {}),
          ...(dto.proposalDate ? { proposalDate: new Date(dto.proposalDate) } : {}),
          ...(dto.customContent !== undefined ? { customContent: dto.customContent } : {}),
          ...(dto.scopeDetails !== undefined ? { scopeDetails: dto.scopeDetails } : {}),
        },
      });
    }

    // Sync clientName & clientLogo on the Deal model if passed
    if (proposal.dealId && (dto.clientName || dto.clientLogo !== undefined)) {
      await this.prisma.deal.update({
        where: { id: proposal.dealId },
        data: {
          ...(dto.clientName ? { clientName: dto.clientName } : {}),
          ...(dto.clientLogo !== undefined ? { clientLogo: dto.clientLogo } : {}),
        },
      });
    }

    // Also sync logo to the Client table if client exists
    if (dto.clientLogo) {
      const targetClientName = dto.clientName || proposal.deal?.clientName;
      if (targetClientName) {
        try {
          const clientRec = await this.prisma.client.findFirst({
            where: { name: { equals: targetClientName.trim(), mode: 'insensitive' } },
          });
          if (clientRec) {
            await this.prisma.client.update({
              where: { id: clientRec.id },
              data: { logo: dto.clientLogo },
            });
          }
        } catch (e) {
          // ignore lookup failure
        }
      }
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
