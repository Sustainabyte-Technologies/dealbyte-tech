import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto, NegotiateQuoteDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Controller('quotes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Post()
  create(
    @Body() dto: CreateQuoteDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.quotesService.create(dto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuoteDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.quotesService.update(id, dto, userId);
  }

  @Post(':id/submit-for-approval')
  submitForApproval(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.quotesService.submitForApproval(id, userId);
  }

  @Post(':id/negotiate')
  negotiate(
    @Param('id') id: string,
    @Body() dto: NegotiateQuoteDto,
  ) {
    return this.quotesService.negotiate(id, dto);
  }
}
