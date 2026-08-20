import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ContentLibraryService } from './content-library.service';
import { CreateContentBlockDto, UpdateContentBlockDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { Role } from '../generated/prisma';

@Controller('content-blocks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContentLibraryController {
  constructor(private contentLibraryService: ContentLibraryService) {}

  @Get()
  findAll(@Query('serviceId') serviceId?: string) {
    return this.contentLibraryService.findAll(serviceId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  create(@Body() dto: CreateContentBlockDto) {
    return this.contentLibraryService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ESTIMATION_LEAD)
  update(@Param('id') id: string, @Body() dto: UpdateContentBlockDto) {
    return this.contentLibraryService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.contentLibraryService.delete(id);
  }
}
