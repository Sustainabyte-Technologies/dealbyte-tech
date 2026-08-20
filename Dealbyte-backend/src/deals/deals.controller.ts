import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';
import { DealStage } from '../generated/prisma';

@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Get()
  findAll(
    @Query('stage') stage?: DealStage,
    @Query('ownerId') ownerId?: string,
  ) {
    return this.dealsService.findAll({ stage, ownerId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateDealDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.dealsService.create(dto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDealDto) {
    return this.dealsService.update(id, dto);
  }
}
