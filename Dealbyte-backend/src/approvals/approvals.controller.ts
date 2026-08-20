import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApproveRejectDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import { Role } from '../generated/prisma';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @Get()
  @Roles(Role.MANAGER, Role.ADMIN)
  findPending(@Query('approverId') approverId?: string) {
    return this.approvalsService.findPending(approverId);
  }

  @Post(':id/approve')
  @Roles(Role.MANAGER, Role.ADMIN)
  approve(
    @Param('id') id: string,
    @Body() dto: ApproveRejectDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.approvalsService.approve(id, dto, userId);
  }

  @Post(':id/reject')
  @Roles(Role.MANAGER, Role.ADMIN)
  reject(
    @Param('id') id: string,
    @Body() dto: ApproveRejectDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.approvalsService.reject(id, dto, userId);
  }
}
