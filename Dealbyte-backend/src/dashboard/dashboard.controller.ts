import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('costing-margin')
  getCostingMargin() {
    return this.dashboardService.getCostingMargin();
  }

  @Get('proposal-tracker')
  getProposalTracker() {
    return this.dashboardService.getProposalTracker();
  }

  @Get('service-performance')
  getServicePerformance() {
    return this.dashboardService.getServicePerformance();
  }
}
