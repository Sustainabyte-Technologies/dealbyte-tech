import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateManpowerRateDto,
  UpdateManpowerRateDto,
  CreateInstrumentRateDto,
  UpdateInstrumentRateDto,
  CreateHardwareItemDto,
  UpdateHardwareItemDto,
} from './dto';

@Injectable()
export class RateCardsService {
  constructor(private prisma: PrismaService) {}

  // ─── Manpower Rates ─────────────────────────────────────────────────────────

  async findAllManpower() {
    return this.prisma.manpowerRate.findMany({
      orderBy: { role: 'asc' },
      include: { _count: { select: { teamMembers: true } } },
    });
  }

  async createManpower(dto: CreateManpowerRateDto) {
    return this.prisma.manpowerRate.create({ data: dto });
  }

  async updateManpower(id: string, dto: UpdateManpowerRateDto) {
    const existing = await this.prisma.manpowerRate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Manpower rate ${id} not found`);
    return this.prisma.manpowerRate.update({ where: { id }, data: dto });
  }

  async deleteManpower(id: string) {
    const existing = await this.prisma.manpowerRate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Manpower rate ${id} not found`);
    await this.prisma.manpowerRate.delete({ where: { id } });
    return { message: `Manpower rate ${id} deleted` };
  }

  // ─── Instrument Rates ───────────────────────────────────────────────────────

  async findAllInstruments() {
    return this.prisma.instrumentRate.findMany({
      orderBy: { instrumentName: 'asc' },
    });
  }

  async createInstrument(dto: CreateInstrumentRateDto) {
    return this.prisma.instrumentRate.create({ data: dto });
  }

  async updateInstrument(id: string, dto: UpdateInstrumentRateDto) {
    const existing = await this.prisma.instrumentRate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Instrument rate ${id} not found`);
    return this.prisma.instrumentRate.update({ where: { id }, data: dto });
  }

  async deleteInstrument(id: string) {
    const existing = await this.prisma.instrumentRate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Instrument rate ${id} not found`);
    await this.prisma.instrumentRate.delete({ where: { id } });
    return { message: `Instrument rate ${id} deleted` };
  }

  // ─── Hardware Items ─────────────────────────────────────────────────────────

  async findAllHardware() {
    return this.prisma.hardwareItem.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createHardware(dto: CreateHardwareItemDto) {
    return this.prisma.hardwareItem.create({ data: dto });
  }

  async updateHardware(id: string, dto: UpdateHardwareItemDto) {
    const existing = await this.prisma.hardwareItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Hardware item ${id} not found`);
    return this.prisma.hardwareItem.update({ where: { id }, data: dto });
  }

  async deleteHardware(id: string) {
    const existing = await this.prisma.hardwareItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Hardware item ${id} not found`);
    await this.prisma.hardwareItem.delete({ where: { id } });
    return { message: `Hardware item ${id} deleted` };
  }
}
