import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CostingService,
  CostingInput,
  CostingTeamMemberInput,
  CostingInstrumentInput,
  CostingHardwareInput,
} from '../costing/costing.service';
import { CreateQuoteDto, UpdateQuoteDto, NegotiateQuoteDto } from './dto';
import { QuoteStatus } from '../generated/prisma';

@Injectable()
export class QuotesService {
  constructor(
    private prisma: PrismaService,
    private costingService: CostingService,
  ) {}

  async create(dto: CreateQuoteDto, userId: string) {
    // 1. Resolve User ID
    let activeUserId = userId;
    if (!activeUserId) {
      const firstUser = await this.prisma.user.findFirst();
      activeUserId = firstUser?.id || '';
    }

    // 2. Resolve Service ID (Prioritize exact serviceName & category, then serviceId)
    let service: any = null;

    if (dto.serviceName) {
      service = await this.prisma.service.findFirst({
        where: { name: { equals: dto.serviceName, mode: 'insensitive' } },
      });
      if (!service) {
        service = await this.prisma.service.create({
          data: {
            name: dto.serviceName,
            category: dto.category || 'IoT & Controls',
            description: `${dto.serviceName} Scope`,
            hasCostingTemplate: true,
          },
        });
      } else if (dto.category && service.category !== dto.category) {
        service = await this.prisma.service.update({
          where: { id: service.id },
          data: { category: dto.category },
        });
      }
    } else if (dto.serviceId) {
      service = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
      });
    }

    if (!service) {
      service = await this.prisma.service.findFirst();
    }
    const validServiceId = service?.id || '';

    // 3. Resolve or auto-create Deal if dealId is not passed or not found
    let dealId = dto.dealId;
    let deal = dealId
      ? await this.prisma.deal.findUnique({ where: { id: dealId } })
      : null;

    if (!deal) {
      const clientName = dto.clientName || 'General Client';
      deal = await this.prisma.deal.findFirst({
        where: { clientName, serviceId: validServiceId },
      });
      if (!deal) {
        deal = await this.prisma.deal.create({
          data: {
            clientName,
            serviceId: validServiceId,
            ownerId: activeUserId,
            stage: 'ENQUIRY',
            clientLogo: dto.clientLogo || null,
          },
        });
      }
    }
    const resolvedDealId: string = deal.id;

    // Load default margin/buffer from system config
    const defaults = await this.getDefaults();
    const marginPct = dto.marginPct ?? defaults.marginPct;
    const bufferPct = dto.bufferPct ?? defaults.bufferPct;

    // Build costing input by resolving rate card IDs to actual rates
    const costingInput = await this.buildCostingInput(dto, marginPct, bufferPct);
    const result = await this.costingService.calculate(costingInput);

    const parsedDate = dto.proposalDate ? new Date(dto.proposalDate) : new Date();

    const totalProps = await this.prisma.proposal.count();
    const generatedSeq = `STPL-${String(totalProps + 1).padStart(3, '0')}`;
    const effectiveProposalNumber = dto.proposalNumber || generatedSeq;

    // Create quote + line items in a transaction
    const quote = await this.prisma.$transaction(async (tx) => {
      const newQuote = await tx.quote.create({
        data: {
          dealId: resolvedDealId,
          serviceId: validServiceId,
          proposalNumber: effectiveProposalNumber,
          proposalDate: parsedDate,
          clientLogo: dto.clientLogo || null,
          siteDays: dto.siteDays,
          reportDays: dto.reportDays,
          manpowerCost: result.manpowerCost,
          instrumentCost: result.instrumentCost,
          travelKms: dto.travelKms ?? 0,
          travelRatePerKm: dto.travelRatePerKm ?? 4,
          foodRatePerPersonDay: dto.foodRatePerPersonDay ?? 300,
          foodTravelCost: dto.foodTravelCost ?? result.foodTravelCost,
          subtotal: result.subtotal,
          marginPct: result.marginPct,
          marginAmount: result.marginAmount,
          bufferPct: result.bufferPct,
          bufferAmount: result.bufferAmount,
          finalQuote: dto.finalQuote ?? result.finalQuote,
          createdById: activeUserId,
        },
      });

      // Create line items
      if (dto.lineItems && dto.lineItems.length > 0) {
        await tx.quoteLineItem.createMany({
          data: dto.lineItems.map((item) => ({
            quoteId: newQuote.id,
            type: item.type || 'HARDWARE',
            refId: item.refId || null,
            description: item.description || 'Line Item',
            qty: typeof item.qty === 'number' ? item.qty : parseInt(String(item.qty)) || 1,
            unitRate: Number(item.unitRate) || 0,
            total: Number(item.total) || 0,
          })),
        });
      } else if (result.lineItems.length > 0) {
        await tx.quoteLineItem.createMany({
          data: result.lineItems.map((item) => ({
            quoteId: newQuote.id,
            type: item.type,
            refId: item.refId,
            description: item.description,
            qty: item.qty,
            unitRate: item.unitRate,
            total: item.total,
          })),
        });
      }

      // Automatically create a proposal for this quote
      await tx.proposal.create({
        data: {
          quoteId: newQuote.id,
          dealId: resolvedDealId,
          proposalNumber: effectiveProposalNumber,
          proposalDate: parsedDate,
          clientLogo: dto.clientLogo || null,
          status: 'DRAFT',
        },
      });

      // Record Audit Log for Proposal/Quote Creation
      if (activeUserId) {
        await tx.auditLog.create({
          data: {
            userId: activeUserId,
            action: 'CREATE',
            entityType: 'Quote',
            entityId: newQuote.id,
            details: {
              description: `Created Commercial Proposal ${effectiveProposalNumber} for "${dto.clientName || 'Client'}" (Total: ₹${Number(result.finalQuote).toLocaleString('en-IN')})`,
              proposalNumber: effectiveProposalNumber,
              clientName: dto.clientName || 'Client',
              finalQuote: result.finalQuote,
            },
          },
        });
      }

      return newQuote;
    });

    // Update deal stage to QUOTED and update client logo if provided
    await this.prisma.deal.update({
      where: { id: resolvedDealId },
      data: {
        stage: 'QUOTED',
        value: result.finalQuote,
        ...(dto.clientLogo ? { clientLogo: dto.clientLogo } : {}),
      },
    });

    return {
      ...quote,
      breakdown: result,
    };
  }

  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        lineItems: true,
        deal: {
          include: {
            service: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
        service: true,
        createdBy: { select: { id: true, name: true, email: true } },
        approvalRequests: {
          include: {
            approver: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        proposals: { orderBy: { generatedAt: 'desc' } },
      },
    });

    if (!quote) throw new NotFoundException(`Quote ${id} not found`);
    return quote;
  }

  async update(id: string, dto: UpdateQuoteDto, userId: string) {
    const existing = await this.findOne(id);

    let activeUserId = userId;
    if (!activeUserId) {
      const firstUser = await this.prisma.user.findFirst();
      activeUserId = firstUser?.id || '';
    }

    let validServiceId = existing.serviceId;
    if (dto.serviceName) {
      let matchedService = await this.prisma.service.findFirst({
        where: { name: { equals: dto.serviceName, mode: 'insensitive' } },
      });
      if (!matchedService) {
        matchedService = await this.prisma.service.create({
          data: {
            name: dto.serviceName,
            category: dto.category || 'IoT & Controls',
            description: `${dto.serviceName} Scope`,
            hasCostingTemplate: true,
          },
        });
      }
      validServiceId = matchedService.id;
    } else if (dto.serviceId) {
      const service = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
      });
      if (service) {
        validServiceId = service.id;
      }
    }

    const defaults = await this.getDefaults();
    const marginPct = dto.marginPct ?? Number(existing.marginPct);
    const bufferPct = dto.bufferPct ?? Number(existing.bufferPct);

    // Build a full CreateQuoteDto-like object for recalculation
    const recalcDto: CreateQuoteDto = {
      dealId: existing.dealId,
      serviceId: validServiceId,
      siteDays: dto.siteDays ?? existing.siteDays,
      reportDays: dto.reportDays ?? existing.reportDays,
      teamMembers: dto.teamMembers ?? [],
      instruments: dto.instruments,
      hardware: dto.hardware,
      foodTravelCost: dto.foodTravelCost ?? Number(existing.foodTravelCost),
      marginPct,
      bufferPct,
    };

    const costingInput = await this.buildCostingInput(recalcDto, marginPct, bufferPct);
    const result = await this.costingService.calculate(costingInput);

    const parsedDate = dto.proposalDate ? new Date(dto.proposalDate) : existing.proposalDate || new Date();

    // Update in a transaction
    const updated = await this.prisma.$transaction(async (tx) => {
      // Delete old line items
      await tx.quoteLineItem.deleteMany({ where: { quoteId: id } });

      // Update quote
      const updatedQuote = await tx.quote.update({
        where: { id },
        data: {
          serviceId: validServiceId,
          proposalNumber: dto.proposalNumber || existing.proposalNumber || 'STPL-001',
          proposalDate: parsedDate,
          clientLogo: dto.clientLogo !== undefined ? dto.clientLogo : existing.clientLogo,
          siteDays: recalcDto.siteDays,
          reportDays: recalcDto.reportDays,
          travelKms: dto.travelKms ?? existing.travelKms ?? 0,
          travelRatePerKm: dto.travelRatePerKm ?? Number(existing.travelRatePerKm || 4),
          foodRatePerPersonDay: dto.foodRatePerPersonDay ?? Number(existing.foodRatePerPersonDay || 300),
          manpowerCost: result.manpowerCost,
          instrumentCost: result.instrumentCost,
          foodTravelCost: result.foodTravelCost,
          subtotal: result.subtotal,
          marginPct: result.marginPct,
          marginAmount: result.marginAmount,
          bufferPct: result.bufferPct,
          bufferAmount: result.bufferAmount,
          finalQuote: dto.finalQuote ?? result.finalQuote,
        },
      });

      // Recreate line items
      if (dto.lineItems && dto.lineItems.length > 0) {
        await tx.quoteLineItem.createMany({
          data: dto.lineItems.map((item) => ({
            quoteId: id,
            type: item.type || 'HARDWARE',
            refId: item.refId || null,
            description: item.description || 'Line Item',
            qty: typeof item.qty === 'number' ? item.qty : parseInt(String(item.qty)) || 1,
            unitRate: Number(item.unitRate) || 0,
            total: Number(item.total) || 0,
          })),
        });
      } else if (result.lineItems.length > 0) {
        await tx.quoteLineItem.createMany({
          data: result.lineItems.map((item) => ({
            quoteId: id,
            type: item.type,
            refId: item.refId,
            description: item.description,
            qty: item.qty,
            unitRate: item.unitRate,
            total: item.total,
          })),
        });
      }

      // Sync Proposal record
      const proposal = await tx.proposal.findFirst({ where: { quoteId: id } });
      if (proposal) {
        await tx.proposal.update({
          where: { id: proposal.id },
          data: {
            proposalNumber: dto.proposalNumber || existing.proposalNumber || 'STPL-001',
            proposalDate: parsedDate,
            clientLogo: dto.clientLogo !== undefined ? dto.clientLogo : existing.clientLogo,
          },
        });
      }

      // Sync Deal clientName if passed
      if (dto.clientName && existing.dealId) {
        await tx.deal.update({
          where: { id: existing.dealId },
          data: { clientName: dto.clientName, value: result.finalQuote },
        });
      }

      // Record Audit Log for Proposal/Quote Update
      if (activeUserId) {
        await tx.auditLog.create({
          data: {
            userId: activeUserId,
            action: 'UPDATE',
            entityType: 'Quote',
            entityId: id,
            details: {
              description: `Edited Commercial Proposal ${dto.proposalNumber || existing.proposalNumber || 'STPL-001'} for "${dto.clientName || existing.deal?.clientName || 'Client'}" (Updated Total: ₹${Number(result.finalQuote).toLocaleString('en-IN')})`,
              proposalNumber: dto.proposalNumber || existing.proposalNumber,
              clientName: dto.clientName || existing.deal?.clientName,
              finalQuote: result.finalQuote,
            },
          },
        });
      }

      return updatedQuote;
    });

    return { ...updated, breakdown: result };
  }

  async submitForApproval(id: string, userId: string) {
    const quote = await this.findOne(id);

    if (quote.status !== QuoteStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT quotes can be submitted for approval');
    }

    // Find a manager to approve
    const manager = await this.prisma.user.findFirst({
      where: { role: 'MANAGER' },
    });

    if (!manager) {
      throw new BadRequestException('No manager found to approve this quote');
    }

    // Create approval request + update quote status
    await this.prisma.$transaction(async (tx) => {
      await tx.approvalRequest.create({
        data: {
          quoteId: id,
          requestedById: userId,
          approverId: manager.id,
          reason: `Quote for deal requires approval`,
        },
      });

      await tx.quote.update({
        where: { id },
        data: { status: QuoteStatus.PENDING_APPROVAL },
      });
    });

    return { message: 'Quote submitted for approval', approverId: manager.id };
  }

  async negotiate(id: string, dto: NegotiateQuoteDto) {
    const quote = await this.findOne(id);

    if (
      quote.status !== QuoteStatus.APPROVED &&
      quote.status !== QuoteStatus.DRAFT
    ) {
      throw new BadRequestException(
        'Only APPROVED or DRAFT quotes can be negotiated',
      );
    }

    // Check negotiation margin floor
    const floorConfig = await this.prisma.systemConfig.findUnique({
      where: { key: 'NEGOTIATION_MARGIN_FLOOR' },
    });
    const floor = parseFloat(floorConfig?.value || '15');

    if (dto.negotiationMarginPct < floor) {
      throw new ForbiddenException(
        `Negotiation margin ${dto.negotiationMarginPct}% is below the approved floor of ${floor}%. A fresh approval is required.`,
      );
    }

    // Recalculate with new margin
    const lineItems = quote.lineItems;
    const subtotal =
      Number(quote.manpowerCost) +
      Number(quote.instrumentCost) +
      Number(quote.foodTravelCost);

    const marginAmount = Math.round(subtotal * (dto.negotiationMarginPct / 100) * 100) / 100;
    const withMargin = subtotal + marginAmount;
    const bufferAmount = Math.round(withMargin * (Number(quote.bufferPct) / 100) * 100) / 100;
    const finalQuote = withMargin + bufferAmount;

    const updated = await this.prisma.quote.update({
      where: { id },
      data: {
        negotiationMarginPct: dto.negotiationMarginPct,
        marginPct: dto.negotiationMarginPct,
        marginAmount,
        bufferAmount,
        finalQuote,
      },
      include: { lineItems: true },
    });

    // Update deal stage to negotiation
    await this.prisma.deal.update({
      where: { id: quote.dealId },
      data: { stage: 'NEGOTIATION', value: finalQuote },
    });

    return updated;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async getDefaults() {
    const configs = await this.prisma.systemConfig.findMany({
      where: {
        key: { in: ['DEFAULT_MARGIN_PCT', 'DEFAULT_BUFFER_PCT'] },
      },
    });
    const map = new Map(configs.map((c) => [c.key, c.value]));
    return {
      marginPct: parseFloat(map.get('DEFAULT_MARGIN_PCT') || '40'),
      bufferPct: parseFloat(map.get('DEFAULT_BUFFER_PCT') || '10'),
    };
  }

  private async buildCostingInput(
    dto: CreateQuoteDto,
    marginPct: number,
    bufferPct: number,
  ): Promise<CostingInput> {
    // Resolve manpower rates
    const teamMembers: CostingTeamMemberInput[] = [];
    for (const member of dto.teamMembers || []) {
      let rate = await this.prisma.manpowerRate.findUnique({
        where: { id: member.manpowerRateId },
      });
      if (!rate) {
        rate = await this.prisma.manpowerRate.findFirst();
      }
      if (rate) {
        teamMembers.push({
          manpowerRateId: rate.id,
          name: rate.role,
          ratePerDay: Number(rate.ratePerDay),
          siteDays: member.siteDays || dto.siteDays,
          reportDays: member.reportDays || dto.reportDays,
        });
      }
    }

    // Resolve instrument rates
    const instruments: CostingInstrumentInput[] = [];
    for (const inst of dto.instruments || []) {
      let rate = await this.prisma.instrumentRate.findUnique({
        where: { id: inst.instrumentRateId },
      });
      if (!rate) {
        rate = await this.prisma.instrumentRate.findFirst();
      }
      if (rate) {
        instruments.push({
          instrumentRateId: rate.id,
          instrumentName: rate.instrumentName,
          rentalRatePerDay: Number(rate.rentalRatePerDay),
          siteDays: inst.siteDays || dto.siteDays,
        });
      }
    }

    // Resolve hardware items
    const hardware: CostingHardwareInput[] = [];
    for (const hw of dto.hardware || []) {
      const item = await this.prisma.hardwareItem.findUnique({
        where: { id: hw.hardwareItemId },
      });
      if (!item) {
        throw new NotFoundException(
          `Hardware item ${hw.hardwareItemId} not found`,
        );
      }
      hardware.push({
        hardwareItemId: item.id,
        name: item.name,
        unitCost: Number(item.unitCost),
        qty: hw.qty,
      });
    }

    return {
      teamMembers,
      instruments,
      hardware,
      foodTravelCost: dto.foodTravelCost || 0,
      marginPct,
      bufferPct,
    };
  }
}
