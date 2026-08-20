import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.systemConfig.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async update(key: string, value: string) {
    const existing = await this.prisma.systemConfig.findUnique({
      where: { key },
    });
    if (!existing) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }

    return this.prisma.systemConfig.update({
      where: { key },
      data: { value },
    });
  }

  async bulkUpdate(updates: Array<{ key: string; value: string }>) {
    const results: Awaited<ReturnType<typeof this.update>>[] = [];
    for (const item of updates) {
      results.push(await this.update(item.key, item.value));
    }
    return results;
  }
}
