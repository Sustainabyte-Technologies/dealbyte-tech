import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentBlockDto, UpdateContentBlockDto } from './dto';

@Injectable()
export class ContentLibraryService {
  constructor(private prisma: PrismaService) {}

  async findAll(serviceId?: string) {
    const where = serviceId ? { serviceId } : {};
    return this.prisma.contentBlock.findMany({
      where,
      orderBy: [{ section: 'asc' }, { title: 'asc' }],
      include: {
        service: { select: { id: true, name: true } },
      },
    });
  }

  async create(dto: CreateContentBlockDto) {
    return this.prisma.contentBlock.create({
      data: dto,
      include: { service: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, dto: UpdateContentBlockDto) {
    const existing = await this.prisma.contentBlock.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Content block ${id} not found`);
    return this.prisma.contentBlock.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.contentBlock.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Content block ${id} not found`);
    await this.prisma.contentBlock.delete({ where: { id } });
    return { message: `Content block ${id} deleted` };
  }
}
