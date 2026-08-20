import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

export const DEFAULT_CLIENTS = [
  'ABT Maruti',
  'Adam Compressors',
  'Aisan auto parts',
  'Alstom',
  'ANTB',
  'Arun Plasto',
  'Apollo Tyres',
  'Ashveera Elgi Dealer',
  'Bharat Forge',
  'Bluestar-climatech',
  'Bull India',
  'Century panels',
  'Cholayil',
  'Chloride Metals Limited',
  'Coburg Engineering',
  'Danfoss Industries Ltd',
  'Denali',
  'DLF Porur',
  'Endurance',
  'Enfield Air Technologies',
  'ES Electronics',
  'Featherlite',
  'Fusion Engineering Kaeser Dealer',
  'Fuso Glass',
  'Grasim Industries',
  'Hatsun',
  'Hine Hydraulics',
  'IGCAR',
  'IMOP',
  'India Japan Lighting',
  'JN Machineries',
  'KKP Spinning mill',
  'Knauf',
  'Komter Equipments',
  'Kone elevators',
  'KPR Mill Ltd',
  'L&T Valves Ltd',
  'Lucas TVS Padi',
  'Lucas TVS -pondichery',
  'Madras Hydraulics',
  'Mahindra & Mahindra',
  'Manatec',
  'MAS Udyag',
  'Maxair',
  'Meenakshi Pneumatics',
  'Michelin Tyres',
  'Microlabs',
  'Moon beverages',
  'MRF Tyres',
  'Panasonic Life Solutions',
  'Piramal Pharma',
  'PMEL India Pvt Ltd',
  'Pneumsys',
  'Polyhose ',
  'Purple Star',
  'RK Industries',
  'Rockwool',
  'Royal Enfield',
  'Senvion Wind Energy',
  'SFL Hot & Warm',
  'SFL Wind unit',
  'Sharda Motors',
  'Solidpro',
  'SRM Glowguard ',
  'SRM IST College Campus',
  'SRM IST Valliammai Campus',
  'Star Engineering Kaeser Dealer',
  'Suguna Foods',
  'Sungwoo India AP',
  'Sags Apparels',
  'TAFE',
  'TAPCO Pneumatics',
  'Tata Electronics',
  'TVS Two Wheeler',
  'Vajram Apartments',
  'Varroc Lighting',
  'Velammal Nexus',
  'Vishnu Cars',
  'Velmurugan Industries',
  'Whirlpool - pune',
  'Whirlpool - pondichery',
  'Wheels India EEPD division',
  'Wheels India Fab Unit',
  'Wheels India Sriperampudur unit',
  'World Trade Center - Brigade group',
];

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Ensure all default clients are seeded into PostgreSQL DB
    await this.prisma.client.createMany({
      data: DEFAULT_CLIENTS.map((name) => ({ name: name.trim() })),
      skipDuplicates: true,
    });

    return this.prisma.client.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateClientDto) {
    const name = dto.name.trim();
    const existing = await this.prisma.client.findUnique({
      where: { name },
    });

    if (existing) {
      if (dto.logo && !existing.logo) {
        return this.prisma.client.update({
          where: { id: existing.id },
          data: { logo: dto.logo },
        });
      }
      return existing;
    }

    return this.prisma.client.create({
      data: {
        name,
        logo: dto.logo || null,
      },
    });
  }

  async update(id: string, dto: UpdateClientDto) {
    const existing = await this.prisma.client.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    if (dto.name && dto.name.trim() !== existing.name) {
      const duplicate = await this.prisma.client.findUnique({
        where: { name: dto.name.trim() },
      });
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException(`Client with name "${dto.name}" already exists`);
      }
    }

    return this.prisma.client.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name.trim() } : {}),
        ...(dto.logo !== undefined ? { logo: dto.logo } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}
