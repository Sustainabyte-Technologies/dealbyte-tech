import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RateCardsService } from './rate-cards.service';
import {
  CreateManpowerRateDto,
  UpdateManpowerRateDto,
  CreateInstrumentRateDto,
  UpdateInstrumentRateDto,
  CreateHardwareItemDto,
  UpdateHardwareItemDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { Role } from '../generated/prisma';

@Controller('rate-cards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RateCardsController {
  constructor(private rateCardsService: RateCardsService) {}

  // ─── Manpower ───────────────────────────────────────────────────────────────

  @Get('manpower')
  findAllManpower() {
    return this.rateCardsService.findAllManpower();
  }

  @Post('manpower')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  createManpower(@Body() dto: CreateManpowerRateDto) {
    return this.rateCardsService.createManpower(dto);
  }

  @Patch('manpower/:id')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  updateManpower(@Param('id') id: string, @Body() dto: UpdateManpowerRateDto) {
    return this.rateCardsService.updateManpower(id, dto);
  }

  @Delete('manpower/:id')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  deleteManpower(@Param('id') id: string) {
    return this.rateCardsService.deleteManpower(id);
  }

  // ─── Instruments ────────────────────────────────────────────────────────────

  @Get('instruments')
  findAllInstruments() {
    return this.rateCardsService.findAllInstruments();
  }

  @Post('instruments')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  createInstrument(@Body() dto: CreateInstrumentRateDto) {
    return this.rateCardsService.createInstrument(dto);
  }

  @Patch('instruments/:id')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  updateInstrument(@Param('id') id: string, @Body() dto: UpdateInstrumentRateDto) {
    return this.rateCardsService.updateInstrument(id, dto);
  }

  @Delete('instruments/:id')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  deleteInstrument(@Param('id') id: string) {
    return this.rateCardsService.deleteInstrument(id);
  }

  // ─── Hardware ───────────────────────────────────────────────────────────────

  @Get('hardware')
  findAllHardware() {
    return this.rateCardsService.findAllHardware();
  }

  @Post('hardware')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  createHardware(@Body() dto: CreateHardwareItemDto) {
    return this.rateCardsService.createHardware(dto);
  }

  @Patch('hardware/:id')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  updateHardware(@Param('id') id: string, @Body() dto: UpdateHardwareItemDto) {
    return this.rateCardsService.updateHardware(id, dto);
  }

  @Delete('hardware/:id')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  deleteHardware(@Param('id') id: string) {
    return this.rateCardsService.deleteHardware(id);
  }
}
