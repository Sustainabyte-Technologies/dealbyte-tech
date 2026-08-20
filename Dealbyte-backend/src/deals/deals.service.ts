import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { DealStage } from '../generated/prisma';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { stage?: DealStage; ownerId?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.stage) where.stage = filters.stage;
    if (filters?.ownerId) where.ownerId = filters.ownerId;

    return this.prisma.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        service: { select: { id: true, name: true, category: true } },
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { quotes: true, proposals: true } },
      },
    });
  }

  async findOne(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        service: true,
        owner: { select: { id: true, name: true, email: true, role: true } },
        quotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: { select: { id: true, name: true } },
          },
        },
        proposals: { orderBy: { generatedAt: 'desc' } },
      },
    });
    if (!deal) throw new NotFoundException(`Deal ${id} not found`);
    return deal;
  }

  async create(dto: CreateDealDto, ownerId: string) {
    let activeOwnerId = ownerId;
    if (!activeOwnerId) {
      const firstUser = await this.prisma.user.findFirst();
      activeOwnerId = firstUser?.id || '';
    }

    let validServiceId = dto.serviceId;
    const service = await this.prisma.service.findUnique({
      where: { id: validServiceId },
    });
    if (!service) {
      const firstService = await this.prisma.service.findFirst();
      if (firstService) {
        validServiceId = firstService.id;
      }
    }

    return this.prisma.deal.create({
      data: {
        clientName: dto.clientName,
        serviceId: validServiceId,
        ownerId: activeOwnerId,
        value: dto.value,
      },
      include: {
        service: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, dto: UpdateDealDto) {
    await this.findOne(id);
    return this.prisma.deal.update({
      where: { id },
      data: dto,
      include: {
        service: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
    });
  }
}
