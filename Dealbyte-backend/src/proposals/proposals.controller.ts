import {
  Controller, Get, Post, Patch, Put, Body, Param, UseGuards,
} from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { GenerateProposalDto, UpdateProposalStatusDto, UpdateProposalDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Controller('proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProposalsController {
  constructor(private proposalsService: ProposalsService) {}

  @Post('generate')
  generate(@Body() dto: GenerateProposalDto) {
    return this.proposalsService.generate(dto);
  }

  @Get()
  findAll() {
    return this.proposalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proposalsService.findOne(id);
  }

  @Put(':id')
  updatePut(
    @Param('id') id: string,
    @Body() dto: UpdateProposalDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.proposalsService.update(id, dto, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProposalDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.proposalsService.update(id, dto, userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateProposalStatusDto) {
    return this.proposalsService.updateStatus(id, dto);
  }
}
