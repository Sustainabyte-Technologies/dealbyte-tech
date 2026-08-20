import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CostingService } from './costing.service';
import { SaveCostingTemplateDto } from './dto/create-costing-template.dto';
import { SaveCostingSheetDto } from './dto/create-costing-sheet.dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';

@Controller('costing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CostingController {
  constructor(private readonly costingService: CostingService) {}

  @Post('calculate')
  calculate(@Body() input: any) {
    return this.costingService.calculate(input);
  }

  // ─── COSTING TEMPLATE ENDPOINTS ─────────────────────────────────────────

  @Post('templates')
  saveTemplate(@Body() dto: SaveCostingTemplateDto, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveTemplate(dto, userId);
  }

  @Get('templates')
  getTemplates() {
    return this.costingService.getTemplates();
  }

  @Get('templates/by-service/:serviceIdOrName')
  getTemplateByService(@Param('serviceIdOrName') serviceIdOrName: string) {
    return this.costingService.getTemplateByService(serviceIdOrName);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.costingService.deleteTemplate(id);
  }

  // ─── COSTING SHEET SUBMISSION ENDPOINTS ──────────────────────────────────

  @Post('sheets')
  saveSheet(@Body() dto: SaveCostingSheetDto, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveSheet(dto, userId);
  }

  @Put('sheets/:id')
  updateSheet(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveSheet({ ...dto, id }, userId);
  }

  @Get('sheets')
  getSheets(
    @Query('id') id?: string,
    @Query('clientId') clientId?: string,
    @Query('clientName') clientName?: string,
    @Query('serviceCategory') serviceCategory?: string,
    @Query('subService') subService?: string,
    @Query('projectName') projectName?: string,
    @Query('stationType') stationType?: string,
  ) {
    return this.costingService.getSheets({
      id,
      clientId,
      clientName,
      serviceCategory,
      subService,
      projectName,
      stationType,
    });
  }

  @Get('sheets/:id')
  getSheetById(@Param('id') id: string) {
    return this.costingService.getSheetById(id);
  }

  @Delete('sheets/by-mapping')
  deleteSheetsByMapping(
    @Query('clientName') clientName?: string,
    @Query('serviceCategory') serviceCategory?: string,
    @Query('subService') subService?: string,
    @Query('projectName') projectName?: string,
  ) {
    return this.costingService.deleteSheetsByMapping({
      clientName,
      serviceCategory,
      subService,
      projectName,
    });
  }

  @Delete('sheets/:id')
  deleteSheet(@Param('id') id: string) {
    return this.costingService.deleteSheet(id);
  }

  // ─── DEDICATED AIR AUDIT ENDPOINTS ─────────────────────────────────────

  @Post('air-audit/template')
  saveAirAuditTemplate(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveAirAuditTemplate(dto, userId);
  }

  @Get('air-audit/template')
  getAirAuditTemplate() {
    return this.costingService.getAirAuditTemplate();
  }

  @Post('air-audit/sheets')
  saveAirAuditSheet(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveAirAuditSheet(dto, userId);
  }

  @Put('air-audit/sheets/:id')
  updateAirAuditSheet(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveAirAuditSheet({ ...dto, id }, userId);
  }

  @Get('air-audit/sheets')
  getAirAuditSheets(@Query('clientName') clientName?: string) {
    return this.costingService.getAirAuditSheets(clientName);
  }

  @Delete('air-audit/sheets/:id')
  deleteAirAuditSheet(@Param('id') id: string) {
    return this.costingService.deleteAirAuditSheet(id);
  }

  // ─── DEDICATED ENERGY AUDIT ENDPOINTS ───────────────────────────────────

  @Post('energy-audit/template')
  saveEnergyAuditTemplate(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveEnergyAuditTemplate(dto, userId);
  }

  @Get('energy-audit/template')
  getEnergyAuditTemplate() {
    return this.costingService.getEnergyAuditTemplate();
  }

  @Post('energy-audit/sheets')
  saveEnergyAuditSheet(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveEnergyAuditSheet(dto, userId);
  }

  @Put('energy-audit/sheets/:id')
  updateEnergyAuditSheet(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveEnergyAuditSheet({ ...dto, id }, userId);
  }

  @Get('energy-audit/sheets')
  getEnergyAuditSheets(@Query('clientName') clientName?: string) {
    return this.costingService.getEnergyAuditSheets(clientName);
  }

  @Delete('energy-audit/sheets/:id')
  deleteEnergyAuditSheet(@Param('id') id: string) {
    return this.costingService.deleteEnergyAuditSheet(id);
  }

  // ─── DEDICATED AIR AUDIT RECTIFICATION ENDPOINTS ───────────────────────

  @Post('air-audit-rectification/template')
  saveAirAuditRectificationTemplate(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveAirAuditRectificationTemplate(dto, userId);
  }

  @Get('air-audit-rectification/template')
  getAirAuditRectificationTemplate() {
    return this.costingService.getAirAuditRectificationTemplate();
  }

  @Post('air-audit-rectification/sheets')
  saveAirAuditRectificationSheet(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveAirAuditRectificationSheet(dto, userId);
  }

  @Put('air-audit-rectification/sheets/:id')
  updateAirAuditRectificationSheet(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveAirAuditRectificationSheet({ ...dto, id }, userId);
  }

  @Get('air-audit-rectification/sheets')
  getAirAuditRectificationSheets(@Query('clientName') clientName?: string) {
    return this.costingService.getAirAuditRectificationSheets(clientName);
  }

  @Delete('air-audit-rectification/sheets/:id')
  deleteAirAuditRectificationSheet(@Param('id') id: string) {
    return this.costingService.deleteAirAuditRectificationSheet(id);
  }

  // ─── DEDICATED EMS / IOT & CONTROLS ENDPOINTS ─────────────────────────

  @Post('ems/template')
  saveEmsTemplate(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveTemplate({ ...dto, isEms: true, serviceName: dto.serviceName || 'IoT & Controls' }, userId);
  }

  @Get('ems/template')
  getEmsTemplate(@Query('serviceName') serviceName?: string) {
    return this.costingService.getTemplateByService(serviceName || 'IoT & Controls');
  }

  @Post('ems/sheets')
  saveEmsSheet(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveSheet({ ...dto, isEms: true }, userId);
  }

  @Put('ems/sheets/:id')
  updateEmsSheet(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.costingService.saveSheet({ ...dto, id, isEms: true }, userId);
  }

  @Get('ems/sheets')
  getEmsSheets(@Query('clientName') clientName?: string, @Query('subService') subService?: string) {
    return this.costingService.getSheets(clientName, subService);
  }

  @Delete('ems/sheets/:id')
  deleteEmsSheet(@Param('id') id: string) {
    return this.costingService.deleteSheet(id);
  }
}
