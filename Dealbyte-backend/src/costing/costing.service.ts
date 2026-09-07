import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Input for a single team member in the costing calculation.
 */
export interface CostingTeamMemberInput {
  manpowerRateId: string;
  /** Name or role label for the line item description */
  name: string;
  /** The rate per day (from ManpowerRate) */
  ratePerDay: number;
  /** How many site days this person is allocated */
  siteDays: number;
  /** How many report days this person is allocated */
  reportDays: number;
}

/**
 * Input for a single instrument in the costing calculation.
 */
export interface CostingInstrumentInput {
  instrumentRateId: string;
  instrumentName: string;
  rentalRatePerDay: number;
  siteDays: number;
}

/**
 * Input for a single hardware item in the costing calculation.
 */
export interface CostingHardwareInput {
  hardwareItemId: string;
  name: string;
  unitCost: number;
  qty: number;
}

/**
 * Full input for the costing engine.
 */
export interface CostingInput {
  teamMembers: CostingTeamMemberInput[];
  instruments: CostingInstrumentInput[];
  hardware: CostingHardwareInput[];
  foodTravelCost: number;
  marginPct: number;    // e.g. 40
  bufferPct: number;    // e.g. 10
}

/**
 * Line-item breakdown returned by the costing engine.
 */
export interface CostingLineItem {
  type: 'MANPOWER' | 'INSTRUMENT' | 'HARDWARE' | 'TRAVEL';
  refId: string | null;
  description: string;
  qty: number;
  unitRate: number;
  total: number;
}

/**
 * Full result returned by the costing engine.
 */
export interface CostingResult {
  lineItems: CostingLineItem[];
  manpowerCost: number;
  instrumentCost: number;
  hardwareCost: number;
  foodTravelCost: number;
  subtotal: number;
  marginPct: number;
  marginAmount: number;
  withMargin: number;
  bufferPct: number;
  bufferAmount: number;
  finalQuote: number;
  requiresApproval: boolean;
  approvalReasons: string[];
}

/**
 * CostingService — pure, testable service implementing the costing formula.
 *
 * Formula:
 *   manpowerCost   = Σ(member.rate × (siteDays + reportDays))
 *   instrumentCost = Σ(instrument.rentalRate × siteDays)
 *   hardwareCost   = Σ(hardware.unitCost × qty)
 *   foodTravelCost = provided input
 *   subtotal       = manpowerCost + instrumentCost + hardwareCost + foodTravelCost
 *   marginAmount   = subtotal × (marginPct / 100)
 *   withMargin     = subtotal + marginAmount
 *   bufferAmount   = withMargin × (bufferPct / 100)
 *   finalQuote     = withMargin + bufferAmount
 */
@Injectable()
export class CostingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate the full cost breakdown from inputs.
   * This is a pure calculation — no database side effects.
   */
  async calculate(input: CostingInput): Promise<CostingResult> {
    const lineItems: CostingLineItem[] = [];

    // ─── Manpower Cost ────────────────────────────────────────────────────
    let manpowerCost = 0;
    for (const member of input.teamMembers) {
      const totalDays = member.siteDays + member.reportDays;
      const total = this.round(member.ratePerDay * totalDays);
      manpowerCost += total;
      lineItems.push({
        type: 'MANPOWER',
        refId: member.manpowerRateId,
        description: `${member.name} — ${member.siteDays} site days + ${member.reportDays} report days`,
        qty: totalDays,
        unitRate: member.ratePerDay,
        total,
      });
    }

    // ─── Instrument Cost ──────────────────────────────────────────────────
    let instrumentCost = 0;
    for (const instrument of input.instruments) {
      const total = this.round(instrument.rentalRatePerDay * instrument.siteDays);
      instrumentCost += total;
      lineItems.push({
        type: 'INSTRUMENT',
        refId: instrument.instrumentRateId,
        description: `${instrument.instrumentName} — ${instrument.siteDays} days rental`,
        qty: instrument.siteDays,
        unitRate: instrument.rentalRatePerDay,
        total,
      });
    }

    // ─── Hardware Cost ────────────────────────────────────────────────────
    let hardwareCost = 0;
    for (const hw of input.hardware) {
      const total = this.round(hw.unitCost * hw.qty);
      hardwareCost += total;
      lineItems.push({
        type: 'HARDWARE',
        refId: hw.hardwareItemId,
        description: `${hw.name} × ${hw.qty}`,
        qty: hw.qty,
        unitRate: hw.unitCost,
        total,
      });
    }

    // ─── Food & Travel ────────────────────────────────────────────────────
    const foodTravelCost = this.round(input.foodTravelCost);
    if (foodTravelCost > 0) {
      lineItems.push({
        type: 'TRAVEL',
        refId: null,
        description: 'Food & Travel Allowance',
        qty: 1,
        unitRate: foodTravelCost,
        total: foodTravelCost,
      });
    }

    // ─── Costing Formula ──────────────────────────────────────────────────
    const subtotal = this.round(manpowerCost + instrumentCost + hardwareCost + foodTravelCost);
    const marginPct = input.marginPct;
    const isEnergyAudit = !input.hardware || input.hardware.length === 0;
    const marginAmount = isEnergyAudit
      ? this.round((subtotal / 0.6) - subtotal)
      : this.round(subtotal * (marginPct / 100));
    const withMargin = this.round(subtotal + marginAmount); // Price = Total Cost + Profit Margin
    const bufferPct = input.bufferPct;
    const bufferAmount = isEnergyAudit
      ? this.round((withMargin / 0.9) - withMargin)
      : this.round(withMargin * (bufferPct / 100));
    const finalQuote = this.round(withMargin + bufferAmount); // Final Quote = Total Price / 0.9

    // ─── Approval Check ──────────────────────────────────────────────────
    const { requiresApproval, approvalReasons } =
      await this.checkApprovalRequired(marginPct, finalQuote);

    return {
      lineItems,
      manpowerCost,
      instrumentCost,
      hardwareCost,
      foodTravelCost,
      subtotal,
      marginPct,
      marginAmount,
      withMargin,
      bufferPct,
      bufferAmount,
      finalQuote,
      requiresApproval,
      approvalReasons,
    };
  }

  /**
   * Check if the quote requires approval based on configurable thresholds.
   */
  private async checkApprovalRequired(
    marginPct: number,
    finalQuote: number,
  ): Promise<{ requiresApproval: boolean; approvalReasons: string[] }> {
    const reasons: string[] = [];

    // Load thresholds from SystemConfig
    const configs = await this.prisma.systemConfig.findMany({
      where: {
        key: {
          in: ['APPROVAL_MARGIN_THRESHOLD', 'APPROVAL_VALUE_THRESHOLD'],
        },
      },
    });

    const configMap = new Map(configs.map((c) => [c.key, c.value]));
    const marginThreshold = parseFloat(
      configMap.get('APPROVAL_MARGIN_THRESHOLD') || '25',
    );
    const valueThreshold = parseFloat(
      configMap.get('APPROVAL_VALUE_THRESHOLD') || '5000000',
    );

    if (marginPct < marginThreshold) {
      reasons.push(
        `Margin ${marginPct}% is below threshold of ${marginThreshold}%`,
      );
    }

    if (finalQuote > valueThreshold) {
      reasons.push(
        `Final quote ₹${finalQuote.toLocaleString()} exceeds threshold of ₹${valueThreshold.toLocaleString()}`,
      );
    }

    return {
      requiresApproval: reasons.length > 0,
      approvalReasons: reasons,
    };
  }

  /** Round to 2 decimal places to avoid floating-point drift. */
  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /** Ensures row objects are stored as clean plain objects and never stripped by JSON.stringify */
  private cleanRowObject(r: any): any {
    if (!r) return null;
    if (Array.isArray(r)) {
      const obj: any = {};
      for (const key of Object.keys(r)) {
        if (!/^\d+$/.test(key)) {
          obj[key] = r[key];
        }
      }
      return Object.keys(obj).length > 0 ? obj : null;
    }
    if (typeof r === 'object') {
      return { ...r };
    }
    return null;
  }

  private cleanRowArray(rows: any): any[] {
    if (!rows || !Array.isArray(rows)) return [];
    return rows.map((r) => this.cleanRowObject(r)).filter(Boolean);
  }

  // ─── COSTING TEMPLATE CRUD ──────────────────────────────────────────────

  async saveTemplate(dto: any, userId?: string) {
    let serviceId = dto.serviceId;

    // If serviceId is not provided, attempt lookup by serviceName (e.g., "Air Audit")
    if (!serviceId && dto.serviceName) {
      const foundService = await this.prisma.service.findFirst({
        where: { name: { equals: dto.serviceName, mode: 'insensitive' } },
      });
      if (foundService) {
        serviceId = foundService.id;
      }
    }

    const isWelding = dto.isWeldingIot || dto.serviceName?.toLowerCase().includes('welding') || dto.categoryName?.toLowerCase().includes('welding') || dto.serviceName?.toLowerCase().includes('digiweld') || dto.serviceName?.toLowerCase().includes('fusionbyte');
    const isCpm = dto.isCpm || dto.serviceName?.toLowerCase().includes('cpm') || dto.serviceName?.toLowerCase().includes('chiller') || dto.categoryName?.toLowerCase().includes('chiller');
    const isIotControls = (dto.isIotControls || dto.serviceName?.toLowerCase().includes('ir blaster') || dto.categoryName?.toLowerCase().includes('ir blaster')) && !isWelding && !isCpm;
    const isEms = (dto.isEms || dto.serviceName?.toLowerCase().includes('ems') || dto.serviceName?.toLowerCase().includes('energy management') || dto.serviceName?.toLowerCase().includes('compressed air') || dto.serviceName?.toLowerCase().includes('water') || dto.categoryName?.toLowerCase().includes('hardware') || dto.categoryName?.toLowerCase().includes('iot')) && !isWelding && !isCpm && !isIotControls;

    const manpowerPayload = this.cleanRowArray(
      isCpm
        ? (dto.cpmCommissioningManpowerRows || [])
        : (isEms || isIotControls) ? (dto.emsManpowerRows || dto.manpowerRows || []) : (dto.manpowerRows || [])
    );
    const instrumentPayload = isCpm
      ? {
          isCpm: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          cpmHardwareRows: this.cleanRowArray(dto.cpmHardwareRows),
          cpmElectricalRows: this.cleanRowArray(dto.cpmElectricalRows),
          cpmCommissioningManpowerRows: this.cleanRowArray(dto.cpmCommissioningManpowerRows),
          cpmInstallationRows: this.cleanRowArray(dto.cpmInstallationRows),
          cpmInstallationManpowerRows: this.cleanRowArray(dto.cpmInstallationManpowerRows),
          cpmOnPremiseRows: this.cleanRowArray(dto.cpmOnPremiseRows),
          cpmCloudChargeRows: this.cleanRowArray(dto.cpmCloudChargeRows),
          cpmCloudRows: this.cleanRowArray(dto.cpmCloudRows),
          totalHardwareCost: dto.totalHardwareCost || 0,
          totalConsumablesCost: dto.totalConsumablesCost || 0,
          totalCommissioningCost: dto.totalCommissioningCost || 0,
          totalInstallationCost: dto.totalInstallationCost || 0,
          totalOnPremiseCost: dto.totalOnPremiseCost || 0,
          totalCloudCost: dto.totalCloudCost || 0,
          roundingNearest: dto.roundingNearest || 100,
        }
      : isIotControls
      ? {
          isIotControls: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          iotControlsHardwareRows: this.cleanRowArray(dto.iotControlsHardwareRows),
          iotControlsMandaysRows: this.cleanRowArray(dto.iotControlsMandaysRows),
          iotControlsTravelRows: this.cleanRowArray(dto.iotControlsTravelRows),
          iotControlsOpexRows: this.cleanRowArray(dto.iotControlsOpexRows),
          iotControlsRoiState: dto.iotControlsRoiState || {},
          iotPackagingPct: dto.iotPackagingPct !== undefined ? dto.iotPackagingPct : 0,
          iotPackagingMarginPct: dto.iotPackagingMarginPct !== undefined ? dto.iotPackagingMarginPct : 0,
          iotPackagingManualCost: dto.iotPackagingManualCost ?? null,
          iotPackagingManualPrice: dto.iotPackagingManualPrice ?? null,
          extraExpenseRows: this.cleanRowArray(dto.extraExpenses || dto.extraExpenseRows),
          emsManpowerRows: this.cleanRowArray(dto.emsManpowerRows),
          roundingNearest: dto.roundingNearest || 100,
        }
      : isWelding
      ? {
          isWeldingIot: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          weldingHardwareRows: this.cleanRowArray(dto.weldingHardwareRows),
          weldingSoftwareRows: this.cleanRowArray(dto.weldingSoftwareRows),
          weldingCloudRows: this.cleanRowArray(dto.weldingCloudRows),
          weldingInstallationRows: this.cleanRowArray(dto.weldingInstallationRows),
        }
      : isEms
      ? {
          isEms: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          emsHardwareRows: this.cleanRowArray(dto.emsHardwareRows),
          emsGatewayHardwareRows: this.cleanRowArray(dto.emsGatewayHardwareRows),
          emsElectricalHardwareRows: this.cleanRowArray(dto.emsElectricalHardwareRows),
          emsManpowerRows: this.cleanRowArray(dto.emsManpowerRows),
          caaAutoManpowerRows: this.cleanRowArray(dto.caaAutoManpowerRows),
          caaInstManpowerRows: this.cleanRowArray(dto.caaInstManpowerRows),
          emsPlatformRows: this.cleanRowArray(dto.emsPlatformRows),
          emsRecurringRows: this.cleanRowArray(dto.emsRecurringRows),
          roundingNearest: dto.roundingNearest || 100,
        }
      : this.cleanRowArray(dto.instrumentRows);

    // Upsert or create template
    const existing = await this.prisma.costingTemplate.findFirst({
      where: serviceId
        ? { serviceId }
        : { serviceName: { equals: dto.serviceName, mode: 'insensitive' } },
    });

    let template;
    if (existing) {
      template = await this.prisma.costingTemplate.update({
        where: { id: existing.id },
        data: {
          name: dto.name || existing.name,
          categoryName: dto.categoryName,
          serviceName: dto.serviceName,
          serviceId: serviceId || null,
          manpowerRows: manpowerPayload,
          instrumentRows: instrumentPayload as any,
          extraExpenseRows: this.cleanRowArray(dto.extraExpenseRows || dto.extraExpenses || []),
          siteWorkingDays: dto.siteWorkingDays || 1,
          reportWorkingDays: dto.reportWorkingDays || 1,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    } else {
      template = await this.prisma.costingTemplate.create({
        data: {
          name: dto.name,
          categoryName: dto.categoryName,
          serviceName: dto.serviceName,
          serviceId: serviceId || null,
          manpowerRows: manpowerPayload,
          instrumentRows: instrumentPayload as any,
          extraExpenseRows: this.cleanRowArray(dto.extraExpenseRows || dto.extraExpenses || []),
          siteWorkingDays: dto.siteWorkingDays || 1,
          reportWorkingDays: dto.reportWorkingDays || 1,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    }

    // Also mark service hasCostingTemplate = true if matched
    if (serviceId) {
      await this.prisma.service.update({
        where: { id: serviceId },
        data: { hasCostingTemplate: true },
      }).catch(() => null);
    }

    // Record Audit Log if userId present
    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: existing ? 'UPDATE' : 'CREATE',
          entityType: 'CostingTemplate',
          entityId: template.id,
          details: { templateName: template.name, serviceName: template.serviceName },
        },
      }).catch(() => null);
    }

    return this.formatEmsResult(template);
  }

  private formatEmsResult(item: any) {
    if (!item) return item;

    const baseResult = {
      ...item,
      id: item.id,
      _id: item.id,
      clientId: item.clientId || null,
      clientName: item.clientName,
      serviceCategory: item.serviceCategory || '',
      subService: item.subService || item.serviceName || '',
      projectName: item.projectName || '',
      siteName: item.siteName || '',
      stationType: item.stationType || 'Local Station',
      outstationStartLocation: item.outstationStartLocation || '',
      outstationEndLocation: item.outstationEndLocation || '',
      totalManpowerCost: item.totalManpowerCost !== undefined ? Number(item.totalManpowerCost) : 0,
      totalInstrumentCost: item.totalInstrumentCost !== undefined ? Number(item.totalInstrumentCost) : 0,
      totalExtraCost: item.totalExtraCost !== undefined ? Number(item.totalExtraCost) : 0,
      subtotalCost: item.subtotalCost !== undefined ? Number(item.subtotalCost) : 0,
      marginPct: item.marginPct !== undefined ? Number(item.marginPct) : 40,
      marginAmount: item.marginAmount !== undefined ? Number(item.marginAmount) : 0,
      bufferPct: item.bufferPct !== undefined ? Number(item.bufferPct) : 10,
      bufferAmount: item.bufferAmount !== undefined ? Number(item.bufferAmount) : 0,
      finalQuote: item.finalQuote !== undefined ? Number(item.finalQuote) : 0,
      siteWorkingDays: item.siteWorkingDays !== undefined ? Number(item.siteWorkingDays) : 1,
      reportWorkingDays: item.reportWorkingDays !== undefined ? Number(item.reportWorkingDays) : 1,
      manpowerRows: this.cleanRowArray(item.manpowerRows),
      instrumentRows: Array.isArray(item.instrumentRows)
        ? this.cleanRowArray(item.instrumentRows)
        : item.instrumentRows,
      extraExpenseRows: this.cleanRowArray(item.extraExpenseRows || []),
    };

    if (item.instrumentRows && typeof item.instrumentRows === 'object' && !Array.isArray(item.instrumentRows)) {
      const instObj = item.instrumentRows;
      if (instObj.isIotControls || item.subService?.toLowerCase().includes('ir blaster')) {
        return {
          ...baseResult,
          isIotControls: true,
          stationType: item.stationType || instObj.stationType || 'Local Station',
          outstationStartLocation: item.outstationStartLocation || instObj.outstationStartLocation || '',
          outstationEndLocation: item.outstationEndLocation || instObj.outstationEndLocation || '',
          iotControlsHardwareRows: instObj.iotControlsHardwareRows || [],
          iotControlsMandaysRows: instObj.iotControlsMandaysRows || [],
          iotControlsTravelRows: instObj.iotControlsTravelRows || [],
          iotControlsOpexRows: instObj.iotControlsOpexRows || [],
          iotControlsRoiState: instObj.iotControlsRoiState || {},
          iotPackagingPct: instObj.iotPackagingPct !== undefined ? Number(instObj.iotPackagingPct) : 0,
          iotPackagingMarginPct: instObj.iotPackagingMarginPct !== undefined ? Number(instObj.iotPackagingMarginPct) : 0,
          iotPackagingManualCost: instObj.iotPackagingManualCost ?? null,
          iotPackagingManualPrice: instObj.iotPackagingManualPrice ?? null,
          extraExpenseRows: item.extraExpenseRows || instObj.extraExpenseRows || [],
          emsManpowerRows: item.manpowerRows || instObj.emsManpowerRows || [],
          roundingNearest: instObj.roundingNearest ? Number(instObj.roundingNearest) : 100,
        };
      }

      if (instObj.isWeldingIot || item.subService?.toLowerCase().includes('welding') || item.subService?.toLowerCase().includes('digiweld') || item.subService?.toLowerCase().includes('fusionbyte')) {
        return {
          ...baseResult,
          isWeldingIot: true,
          stationType: item.stationType || instObj.stationType || 'Local Station',
          outstationStartLocation: item.outstationStartLocation || instObj.outstationStartLocation || '',
          outstationEndLocation: item.outstationEndLocation || instObj.outstationEndLocation || '',
          weldingHardwareRows: instObj.weldingHardwareRows || [],
          weldingSoftwareRows: instObj.weldingSoftwareRows || [],
          weldingCloudRows: instObj.weldingCloudRows || [],
          weldingInstallationRows: instObj.weldingInstallationRows || [],
        };
      }

      if (instObj.isCpm || item.subService?.toLowerCase().includes('cpm') || item.subService?.toLowerCase().includes('chiller')) {
        return {
          ...baseResult,
          isCpm: true,
          stationType: item.stationType || instObj.stationType || 'Local Station',
          outstationStartLocation: item.outstationStartLocation || instObj.outstationStartLocation || '',
          outstationEndLocation: item.outstationEndLocation || instObj.outstationEndLocation || '',
          cpmHardwareRows: instObj.cpmHardwareRows || [],
          cpmElectricalRows: instObj.cpmElectricalRows || [],
          cpmCommissioningManpowerRows: item.manpowerRows || instObj.cpmCommissioningManpowerRows || [],
          cpmInstallationRows: instObj.cpmInstallationRows || [],
          cpmInstallationManpowerRows: instObj.cpmInstallationManpowerRows || [],
          cpmOnPremiseRows: instObj.cpmOnPremiseRows || [],
          cpmCloudChargeRows: instObj.cpmCloudChargeRows || [],
          cpmCloudRows: instObj.cpmCloudRows || [],
          totalHardwareCost: Number(instObj.totalHardwareCost || 0),
          totalConsumablesCost: Number(instObj.totalConsumablesCost || 0),
          totalCommissioningCost: Number(instObj.totalCommissioningCost || 0),
          totalInstallationCost: Number(instObj.totalInstallationCost || 0),
          totalOnPremiseCost: Number(instObj.totalOnPremiseCost || 0),
          totalCloudCost: Number(instObj.totalCloudCost || 0),
          roundingNearest: instObj.roundingNearest ? Number(instObj.roundingNearest) : 100,
        };
      }

      if (instObj.isEms || item.subService?.toLowerCase().includes('energy management') || item.subService?.toLowerCase().includes('compressed air') || item.subService?.toLowerCase().includes('water') || item.subService?.toLowerCase().includes('ems')) {
        return {
          ...baseResult,
          isEms: true,
          stationType: item.stationType || instObj.stationType || 'Local Station',
          outstationStartLocation: item.outstationStartLocation || instObj.outstationStartLocation || '',
          outstationEndLocation: item.outstationEndLocation || instObj.outstationEndLocation || '',
          emsGatewayHardwareRows: instObj.emsGatewayHardwareRows || [],
          emsElectricalHardwareRows: instObj.emsElectricalHardwareRows || [],
          emsHardwareRows: instObj.emsHardwareRows || [],
          emsManpowerRows: item.manpowerRows || instObj.emsManpowerRows || [],
          caaAutoManpowerRows: instObj.caaAutoManpowerRows || [],
          caaInstManpowerRows: instObj.caaInstManpowerRows || [],
          emsPlatformRows: instObj.emsPlatformRows || [],
          emsRecurringRows: instObj.emsRecurringRows || [],
          roundingNearest: instObj.roundingNearest ? Number(instObj.roundingNearest) : 100,
        };
      }
    }
    return baseResult;
  }

  async getTemplates() {
    const list = await this.prisma.costingTemplate.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { service: true },
    });
    return list.map((item) => this.formatEmsResult(item));
  }

  async getTemplateByService(serviceIdOrName: string) {
    if (!serviceIdOrName) return null;

    const item = await this.prisma.costingTemplate.findFirst({
      where: {
        OR: [
          { serviceId: serviceIdOrName },
          { serviceName: { equals: serviceIdOrName, mode: 'insensitive' } },
          { id: serviceIdOrName },
        ],
      },
      include: { service: true },
    });
    return this.formatEmsResult(item);
  }

  async deleteTemplate(id: string) {
    return this.prisma.costingTemplate.delete({
      where: { id },
    });
  }

  // ─── COSTING SHEET SUBMISSIONS CRUD ──────────────────────────────────────

  async saveSheet(dto: any, userId?: string) {
    let serviceId = dto.serviceId;
    let clientId = dto.clientId;

    // Auto-map client if name provided
    if (!clientId && dto.clientName) {
      const foundClient = await this.prisma.client.findFirst({
        where: { name: { equals: dto.clientName.trim(), mode: 'insensitive' } },
      });
      if (foundClient) {
        clientId = foundClient.id;
      }
    }

    // Auto-map service if subService or serviceCategory provided
    if (!serviceId && (dto.subService || dto.serviceCategory)) {
      const foundService = await this.prisma.service.findFirst({
        where: {
          OR: [
            { name: { equals: dto.subService?.trim(), mode: 'insensitive' } },
            { name: { equals: dto.serviceCategory?.trim(), mode: 'insensitive' } },
          ],
        },
      });
      if (foundService) {
        serviceId = foundService.id;
      }
    }

    const isWelding = dto.isWeldingIot || dto.subService?.toLowerCase().includes('welding') || dto.serviceCategory?.toLowerCase().includes('welding') || dto.subService?.toLowerCase().includes('digiweld') || dto.subService?.toLowerCase().includes('fusionbyte');
    const isCpm = dto.isCpm || dto.subService?.toLowerCase().includes('cpm') || dto.subService?.toLowerCase().includes('chiller') || dto.serviceCategory?.toLowerCase().includes('chiller');
    const isIotControls = (dto.isIotControls || dto.subService?.toLowerCase().includes('ir blaster') || dto.serviceCategory?.toLowerCase().includes('ir blaster')) && !isWelding && !isCpm;
    const isEms = (dto.isEms || dto.subService?.toLowerCase().includes('ems') || dto.subService?.toLowerCase().includes('energy management') || dto.subService?.toLowerCase().includes('compressed air') || dto.subService?.toLowerCase().includes('water') || dto.serviceCategory?.toLowerCase().includes('hardware') || dto.serviceCategory?.toLowerCase().includes('iot')) && !isWelding && !isCpm && !isIotControls;

    const manpowerPayload = this.cleanRowArray(
      isCpm
        ? (dto.cpmCommissioningManpowerRows || [])
        : (isEms || isIotControls) ? (dto.emsManpowerRows || dto.manpowerRows || []) : (dto.manpowerRows || [])
    );
    const instrumentPayload = isCpm
      ? {
          isCpm: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          cpmHardwareRows: this.cleanRowArray(dto.cpmHardwareRows),
          cpmElectricalRows: this.cleanRowArray(dto.cpmElectricalRows),
          cpmCommissioningManpowerRows: this.cleanRowArray(dto.cpmCommissioningManpowerRows),
          cpmInstallationRows: this.cleanRowArray(dto.cpmInstallationRows),
          cpmInstallationManpowerRows: this.cleanRowArray(dto.cpmInstallationManpowerRows),
          cpmOnPremiseRows: this.cleanRowArray(dto.cpmOnPremiseRows),
          cpmCloudChargeRows: this.cleanRowArray(dto.cpmCloudChargeRows),
          cpmCloudRows: this.cleanRowArray(dto.cpmCloudRows),
          totalHardwareCost: dto.totalHardwareCost || 0,
          totalConsumablesCost: dto.totalConsumablesCost || 0,
          totalCommissioningCost: dto.totalCommissioningCost || 0,
          totalInstallationCost: dto.totalInstallationCost || 0,
          totalOnPremiseCost: dto.totalOnPremiseCost || 0,
          totalCloudCost: dto.totalCloudCost || 0,
          roundingNearest: dto.roundingNearest || 100,
        }
      : isIotControls
      ? {
          isIotControls: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          iotControlsHardwareRows: this.cleanRowArray(dto.iotControlsHardwareRows),
          iotControlsMandaysRows: this.cleanRowArray(dto.iotControlsMandaysRows),
          iotControlsTravelRows: this.cleanRowArray(dto.iotControlsTravelRows),
          iotControlsOpexRows: this.cleanRowArray(dto.iotControlsOpexRows),
          iotControlsRoiState: dto.iotControlsRoiState || {},
          iotPackagingPct: dto.iotPackagingPct !== undefined ? dto.iotPackagingPct : 0,
          iotPackagingMarginPct: dto.iotPackagingMarginPct !== undefined ? dto.iotPackagingMarginPct : 0,
          iotPackagingManualCost: dto.iotPackagingManualCost ?? null,
          iotPackagingManualPrice: dto.iotPackagingManualPrice ?? null,
          extraExpenseRows: this.cleanRowArray(dto.extraExpenses || dto.extraExpenseRows),
          emsManpowerRows: this.cleanRowArray(dto.emsManpowerRows),
          roundingNearest: dto.roundingNearest || 100,
        }
      : isWelding
      ? {
          isWeldingIot: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          weldingHardwareRows: this.cleanRowArray(dto.weldingHardwareRows),
          weldingSoftwareRows: this.cleanRowArray(dto.weldingSoftwareRows),
          weldingCloudRows: this.cleanRowArray(dto.weldingCloudRows),
          weldingInstallationRows: this.cleanRowArray(dto.weldingInstallationRows),
        }
      : isEms
      ? {
          isEms: true,
          stationType: dto.stationType,
          outstationStartLocation: dto.outstationStartLocation,
          outstationEndLocation: dto.outstationEndLocation,
          emsHardwareRows: this.cleanRowArray(dto.emsHardwareRows),
          emsGatewayHardwareRows: this.cleanRowArray(dto.emsGatewayHardwareRows),
          emsElectricalHardwareRows: this.cleanRowArray(dto.emsElectricalHardwareRows),
          emsManpowerRows: this.cleanRowArray(dto.emsManpowerRows),
          caaAutoManpowerRows: this.cleanRowArray(dto.caaAutoManpowerRows),
          caaInstManpowerRows: this.cleanRowArray(dto.caaInstManpowerRows),
          emsPlatformRows: this.cleanRowArray(dto.emsPlatformRows),
          emsRecurringRows: this.cleanRowArray(dto.emsRecurringRows),
          roundingNearest: dto.roundingNearest || 100,
        }
      : this.cleanRowArray(dto.instrumentRows);

    const dataObj = {
      clientName: dto.clientName,
      clientId: clientId || null,
      serviceCategory: dto.serviceCategory,
      subService: dto.subService,
      serviceId: serviceId || null,
      templateId: dto.templateId || null,
      projectName: dto.projectName || null,
      siteName: dto.siteName || null,
      stationType: dto.stationType || 'Local Station',
      outstationStartLocation: dto.outstationStartLocation || null,
      outstationEndLocation: dto.outstationEndLocation || null,
      scopeDetails: dto.scopeDetails || null,
      manpowerRows: manpowerPayload,
      instrumentRows: instrumentPayload as any,
      extraExpenseRows: this.cleanRowArray(dto.extraExpenseRows || dto.extraExpenses || []),
      siteWorkingDays: dto.siteWorkingDays ? Number(dto.siteWorkingDays) : 1,
      reportWorkingDays: dto.reportWorkingDays ? Number(dto.reportWorkingDays) : 1,
      totalManpowerCost: dto.totalManpowerCost !== undefined ? Number(dto.totalManpowerCost) : 0,
      totalInstrumentCost: dto.totalInstrumentCost !== undefined ? Number(dto.totalInstrumentCost) : 0,
      totalExtraCost: dto.totalExtraCost !== undefined ? Number(dto.totalExtraCost) : 0,
      subtotalCost: dto.subtotalCost !== undefined ? Number(dto.subtotalCost) : 0,
      marginPct: dto.marginPct !== undefined ? Number(dto.marginPct) : 40,
      marginAmount: dto.marginAmount !== undefined ? Number(dto.marginAmount) : 0,
      bufferPct: dto.bufferPct !== undefined ? Number(dto.bufferPct) : 10,
      bufferAmount: dto.bufferAmount !== undefined ? Number(dto.bufferAmount) : 0,
      finalQuote: dto.finalQuote !== undefined ? Number(dto.finalQuote) : 0,
      status: dto.status || 'SAVED',
    };

    let sheet: any;
    if (dto.id) {
      const existingInCosting = await this.prisma.costingSheet.findUnique({ where: { id: dto.id } });
      if (existingInCosting) {
        sheet = await this.prisma.costingSheet.update({
          where: { id: dto.id },
          data: dataObj,
          include: { service: true, client: true },
        });
      } else {
        const existingAir = await this.prisma.airAuditCostingSheet.findUnique({ where: { id: dto.id } });
        if (existingAir) {
          sheet = await this.prisma.airAuditCostingSheet.update({
            where: { id: dto.id },
            data: {
              clientName: dto.clientName,
              projectName: dto.projectName || null,
              siteName: dto.siteName || null,
              scopeDetails: dto.scopeDetails || null,
              manpowerRows: manpowerPayload,
              instrumentRows: instrumentPayload as any,
              extraExpenseRows: this.cleanRowArray(dto.extraExpenseRows || dto.extraExpenses || []),
              siteWorkingDays: dto.siteWorkingDays ? Number(dto.siteWorkingDays) : 1,
              reportWorkingDays: dto.reportWorkingDays ? Number(dto.reportWorkingDays) : 1,
              totalManpowerCost: dto.totalManpowerCost !== undefined ? Number(dto.totalManpowerCost) : 0,
              totalInstrumentCost: dto.totalInstrumentCost !== undefined ? Number(dto.totalInstrumentCost) : 0,
              totalExtraCost: dto.totalExtraCost !== undefined ? Number(dto.totalExtraCost) : 0,
              subtotalCost: dto.subtotalCost !== undefined ? Number(dto.subtotalCost) : 0,
              marginPct: dto.marginPct !== undefined ? Number(dto.marginPct) : 40,
              marginAmount: dto.marginAmount !== undefined ? Number(dto.marginAmount) : 0,
              bufferPct: dto.bufferPct !== undefined ? Number(dto.bufferPct) : 10,
              bufferAmount: dto.bufferAmount !== undefined ? Number(dto.bufferAmount) : 0,
              finalQuote: dto.finalQuote !== undefined ? Number(dto.finalQuote) : 0,
            },
          });
          return {
            ...sheet,
            _id: sheet.id,
            subService: dto.subService || 'Air Audit',
            serviceCategory: dto.serviceCategory || 'Energy Audit Services',
          };
        }

        const existingEnergy = await this.prisma.energyAuditCostingSheet.findUnique({ where: { id: dto.id } });
        if (existingEnergy) {
          sheet = await this.prisma.energyAuditCostingSheet.update({
            where: { id: dto.id },
            data: {
              clientName: dto.clientName,
              projectName: dto.projectName || null,
              siteName: dto.siteName || null,
              scopeDetails: dto.scopeDetails || null,
              manpowerRows: manpowerPayload,
              instrumentRows: instrumentPayload as any,
              extraExpenseRows: this.cleanRowArray(dto.extraExpenseRows || dto.extraExpenses || []),
              siteWorkingDays: dto.siteWorkingDays ? Number(dto.siteWorkingDays) : 1,
              reportWorkingDays: dto.reportWorkingDays ? Number(dto.reportWorkingDays) : 1,
              totalManpowerCost: dto.totalManpowerCost !== undefined ? Number(dto.totalManpowerCost) : 0,
              totalInstrumentCost: dto.totalInstrumentCost !== undefined ? Number(dto.totalInstrumentCost) : 0,
              totalExtraCost: dto.totalExtraCost !== undefined ? Number(dto.totalExtraCost) : 0,
              subtotalCost: dto.subtotalCost !== undefined ? Number(dto.subtotalCost) : 0,
              marginPct: dto.marginPct !== undefined ? Number(dto.marginPct) : 40,
              marginAmount: dto.marginAmount !== undefined ? Number(dto.marginAmount) : 0,
              bufferPct: dto.bufferPct !== undefined ? Number(dto.bufferPct) : 10,
              bufferAmount: dto.bufferAmount !== undefined ? Number(dto.bufferAmount) : 0,
              finalQuote: dto.finalQuote !== undefined ? Number(dto.finalQuote) : 0,
            },
          });
          return {
            ...sheet,
            _id: sheet.id,
            subService: dto.subService || 'Energy Audit',
            serviceCategory: dto.serviceCategory || 'Energy Audit Services',
          };
        }

        const existingRect = await this.prisma.airAuditRectificationCostingSheet.findUnique({ where: { id: dto.id } });
        if (existingRect) {
          sheet = await this.prisma.airAuditRectificationCostingSheet.update({
            where: { id: dto.id },
            data: {
              clientName: dto.clientName,
              projectName: dto.projectName || null,
              siteName: dto.siteName || null,
              scopeDetails: dto.scopeDetails || null,
              manpowerRows: manpowerPayload,
              instrumentRows: instrumentPayload as any,
              extraExpenseRows: this.cleanRowArray(dto.extraExpenseRows || dto.extraExpenses || []),
              siteWorkingDays: dto.siteWorkingDays ? Number(dto.siteWorkingDays) : 1,
              reportWorkingDays: dto.reportWorkingDays ? Number(dto.reportWorkingDays) : 1,
              totalManpowerCost: dto.totalManpowerCost !== undefined ? Number(dto.totalManpowerCost) : 0,
              totalInstrumentCost: dto.totalInstrumentCost !== undefined ? Number(dto.totalInstrumentCost) : 0,
              totalExtraCost: dto.totalExtraCost !== undefined ? Number(dto.totalExtraCost) : 0,
              subtotalCost: dto.subtotalCost !== undefined ? Number(dto.subtotalCost) : 0,
              marginPct: dto.marginPct !== undefined ? Number(dto.marginPct) : 40,
              marginAmount: dto.marginAmount !== undefined ? Number(dto.marginAmount) : 0,
              bufferPct: dto.bufferPct !== undefined ? Number(dto.bufferPct) : 10,
              bufferAmount: dto.bufferAmount !== undefined ? Number(dto.bufferAmount) : 0,
              finalQuote: dto.finalQuote !== undefined ? Number(dto.finalQuote) : 0,
            },
          });
          return {
            ...sheet,
            _id: sheet.id,
            subService: dto.subService || 'Air Audit Rectification',
            serviceCategory: dto.serviceCategory || 'Energy Audit Services',
          };
        }

        // If not found in any legacy table either, create it in costingSheet!
        sheet = await this.prisma.costingSheet.create({
          data: {
            ...dataObj,
            createdById: userId || null,
          },
          include: { service: true, client: true },
        });
      }
    } else {
      sheet = await this.prisma.costingSheet.create({
        data: {
          ...dataObj,
          createdById: userId || null,
        },
        include: { service: true, client: true },
      });
    }

    // Record Audit Log if userId present
    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: dto.id ? 'UPDATE' : 'CREATE',
          entityType: 'CostingSheet',
          entityId: sheet.id,
          details: {
            clientName: sheet.clientName,
            clientId: sheet.clientId,
            subService: sheet.subService,
            projectName: sheet.projectName,
            stationType: sheet.stationType,
            finalQuote: Number(sheet.finalQuote),
          },
        },
      }).catch(() => null);
    }

    return this.formatEmsResult(sheet);
  }

  async getSheets(
    filter?:
      | {
          id?: string;
          clientId?: string;
          clientName?: string;
          serviceCategory?: string;
          subService?: string;
          projectName?: string;
          stationType?: string;
        }
      | string,
    subServiceParam?: string
  ) {
    const where: any = {};
    let searchClient = '';
    let searchSub = '';
    let searchCat = '';

    if (typeof filter === 'string') {
      searchClient = filter;
      searchSub = subServiceParam || '';
      if (searchClient) where.clientName = { contains: searchClient, mode: 'insensitive' };
      if (searchSub) where.subService = { equals: searchSub, mode: 'insensitive' };
    } else if (filter && typeof filter === 'object') {
      if (filter.id) where.id = filter.id;
      if (filter.clientId) where.clientId = filter.clientId;
      if (filter.clientName) {
        searchClient = filter.clientName;
        where.clientName = { contains: filter.clientName, mode: 'insensitive' };
      }
      if (filter.serviceCategory) {
        searchCat = filter.serviceCategory;
        where.serviceCategory = { equals: filter.serviceCategory, mode: 'insensitive' };
      }
      if (filter.subService) {
        searchSub = filter.subService;
        where.subService = { equals: filter.subService, mode: 'insensitive' };
      }
      if (filter.projectName) where.projectName = { contains: filter.projectName, mode: 'insensitive' };
      if (filter.stationType) where.stationType = { equals: filter.stationType, mode: 'insensitive' };
    }

    // Clean client query for flexible / fuzzy matching (e.g. "Apollo Tyres" vs "Apollo Tyres Ltd")
    const cleanClient = searchClient.replace(/(ltd|pvt|limited|private|inc|corp)\.?/gi, '').trim();

    // 1. Fetch from CostingSheet
    const generalList = await this.prisma.costingSheet
      .findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { service: true, client: true },
      })
      .catch(() => []);

    const formattedGeneral = generalList.map((item) => this.formatEmsResult(item));

    // 2. Fetch from Dedicated Audit Tables
    const auditWhere: any = {};
    if (searchClient) {
      auditWhere.OR = [
        { clientName: { contains: searchClient, mode: 'insensitive' } },
        ...(cleanClient && cleanClient !== searchClient
          ? [{ clientName: { contains: cleanClient, mode: 'insensitive' } }]
          : []),
      ];
    }
    if (typeof filter === 'object' && filter?.id) {
      auditWhere.id = filter.id;
    }

    const shouldIncludeAir =
      (!searchSub && !searchCat) ||
      searchCat.toLowerCase().includes('energy audit') ||
      (searchSub.toLowerCase().includes('air audit') && !searchSub.toLowerCase().includes('rectification'));

    const shouldIncludeEnergy =
      (!searchSub && !searchCat) ||
      searchCat.toLowerCase().includes('energy audit') ||
      searchSub.toLowerCase().includes('energy audit');

    const shouldIncludeRect =
      (!searchSub && !searchCat) ||
      searchCat.toLowerCase().includes('energy audit') ||
      searchSub.toLowerCase().includes('rectification');

    const [airSheets, energySheets, rectSheets] = await Promise.all([
      shouldIncludeAir
        ? this.prisma.airAuditCostingSheet
            .findMany({ where: auditWhere, orderBy: { createdAt: 'desc' } })
            .catch(() => [])
        : [],
      shouldIncludeEnergy
        ? this.prisma.energyAuditCostingSheet
            .findMany({ where: auditWhere, orderBy: { createdAt: 'desc' } })
            .catch(() => [])
        : [],
      shouldIncludeRect
        ? this.prisma.airAuditRectificationCostingSheet
            .findMany({ where: auditWhere, orderBy: { createdAt: 'desc' } })
            .catch(() => [])
        : [],
    ]);

    const formattedAir = airSheets.map((s: any) => ({
      ...s,
      _id: s.id,
      subService: s.subService || 'Air Audit',
      serviceCategory: s.serviceCategory || 'Energy Audit Services',
      manpowerCost: s.totalManpowerCost !== undefined ? Number(s.totalManpowerCost) : Number(s.manpowerCost || 0),
      instrumentCost: s.totalInstrumentCost !== undefined ? Number(s.totalInstrumentCost) : Number(s.instrumentCost || 0),
      totalExtraCost: s.totalExtraCost !== undefined ? Number(s.totalExtraCost) : 0,
      subtotalCost: Number(s.subtotalCost || 0),
      marginPct: Number(s.marginPct || 40),
      marginAmount: Number(s.marginAmount || 0),
      bufferPct: s.bufferPct !== undefined && s.bufferPct !== null ? Number(s.bufferPct) : 10,
      bufferAmount: Number(s.bufferAmount || 0),
      finalQuote: Number(s.finalQuote || 0),
    }));

    const formattedEnergy = energySheets.map((s: any) => ({
      ...s,
      _id: s.id,
      subService: s.subService || 'Energy Audit',
      serviceCategory: s.serviceCategory || 'Energy Audit Services',
      manpowerCost: s.totalManpowerCost !== undefined ? Number(s.totalManpowerCost) : Number(s.manpowerCost || 0),
      instrumentCost: s.totalInstrumentCost !== undefined ? Number(s.totalInstrumentCost) : Number(s.instrumentCost || 0),
      totalExtraCost: s.totalExtraCost !== undefined ? Number(s.totalExtraCost) : 0,
      subtotalCost: Number(s.subtotalCost || 0),
      marginPct: Number(s.marginPct || 40),
      marginAmount: Number(s.marginAmount || 0),
      bufferPct: s.bufferPct !== undefined && s.bufferPct !== null ? Number(s.bufferPct) : 10,
      bufferAmount: Number(s.bufferAmount || 0),
      finalQuote: Number(s.finalQuote || 0),
    }));

    const formattedRect = rectSheets.map((s: any) => ({
      ...s,
      _id: s.id,
      subService: s.subService || 'Air Audit Rectification',
      serviceCategory: s.serviceCategory || 'Energy Audit Services',
      manpowerCost: s.totalManpowerCost !== undefined ? Number(s.totalManpowerCost) : Number(s.manpowerCost || 0),
      instrumentCost: s.totalInstrumentCost !== undefined ? Number(s.totalInstrumentCost) : Number(s.instrumentCost || 0),
      totalExtraCost: s.totalExtraCost !== undefined ? Number(s.totalExtraCost) : 0,
      subtotalCost: Number(s.subtotalCost || 0),
      marginPct: Number(s.marginPct || 40),
      marginAmount: Number(s.marginAmount || 0),
      bufferPct: s.bufferPct !== undefined && s.bufferPct !== null ? Number(s.bufferPct) : 10,
      bufferAmount: Number(s.bufferAmount || 0),
      finalQuote: Number(s.finalQuote || 0),
    }));

    const allCombined = [...formattedGeneral, ...formattedAir, ...formattedEnergy, ...formattedRect];
    return allCombined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSheetById(id: string) {
    const item = await this.prisma.costingSheet.findUnique({
      where: { id },
      include: { service: true, client: true },
    });
    if (item) return this.formatEmsResult(item);

    const airItem = await this.prisma.airAuditCostingSheet.findUnique({ where: { id } });
    if (airItem) {
      return {
        ...airItem,
        subService: 'Air Audit',
        serviceCategory: 'Energy Audit Services',
        manpowerCost: Number(airItem.totalManpowerCost || 0),
        instrumentCost: Number(airItem.totalInstrumentCost || 0),
        totalExtraCost: Number(airItem.totalExtraCost || 0),
        subtotalCost: Number(airItem.subtotalCost || 0),
        finalQuote: Number(airItem.finalQuote || 0),
      };
    }

    const energyItem = await this.prisma.energyAuditCostingSheet.findUnique({ where: { id } });
    if (energyItem) {
      return {
        ...energyItem,
        subService: 'Energy Audit',
        serviceCategory: 'Energy Audit Services',
        manpowerCost: Number(energyItem.totalManpowerCost || 0),
        instrumentCost: Number(energyItem.totalInstrumentCost || 0),
        totalExtraCost: Number(energyItem.totalExtraCost || 0),
        subtotalCost: Number(energyItem.subtotalCost || 0),
        finalQuote: Number(energyItem.finalQuote || 0),
      };
    }

    const rectItem = await this.prisma.airAuditRectificationCostingSheet.findUnique({ where: { id } });
    if (rectItem) {
      return {
        ...rectItem,
        subService: 'Air Audit Rectification',
        serviceCategory: 'Energy Audit Services',
        manpowerCost: Number(rectItem.totalManpowerCost || 0),
        instrumentCost: Number(rectItem.totalInstrumentCost || 0),
        totalExtraCost: Number(rectItem.totalExtraCost || 0),
        subtotalCost: Number(rectItem.subtotalCost || 0),
        finalQuote: Number(rectItem.finalQuote || 0),
      };
    }

    return null;
  }

  async deleteSheet(id: string) {
    try {
      return await this.prisma.costingSheet.delete({
        where: { id },
      });
    } catch {
      try {
        return await this.prisma.airAuditCostingSheet.delete({
          where: { id },
        });
      } catch {
        try {
          return await this.prisma.energyAuditCostingSheet.delete({
            where: { id },
          });
        } catch {
          try {
            return await this.prisma.airAuditRectificationCostingSheet.delete({
              where: { id },
            });
          } catch {
            throw new NotFoundException(`Costing sheet with ID ${id} not found`);
          }
        }
      }
    }
  }

  async deleteSheetsByMapping(filter: {
    clientName?: string;
    serviceCategory?: string;
    subService?: string;
    projectName?: string;
  }) {
    const where: any = {};
    if (filter.clientName) where.clientName = { contains: filter.clientName, mode: 'insensitive' };
    if (filter.serviceCategory) where.serviceCategory = { equals: filter.serviceCategory, mode: 'insensitive' };
    if (filter.subService) where.subService = { equals: filter.subService, mode: 'insensitive' };
    if (filter.projectName) where.projectName = { contains: filter.projectName, mode: 'insensitive' };

    const deletedCosting = await this.prisma.costingSheet.deleteMany({ where }).catch(() => ({ count: 0 }));

    const auditWhere: any = {};
    if (filter.clientName) auditWhere.clientName = { contains: filter.clientName, mode: 'insensitive' };
    if (filter.projectName) auditWhere.projectName = { contains: filter.projectName, mode: 'insensitive' };

    let deletedAir = { count: 0 };
    let deletedEnergy = { count: 0 };
    let deletedRect = { count: 0 };

    if (!filter.subService || filter.subService.toLowerCase().includes('air audit rectification')) {
      deletedRect = await this.prisma.airAuditRectificationCostingSheet.deleteMany({ where: auditWhere }).catch(() => ({ count: 0 }));
    }
    if (!filter.subService || (filter.subService.toLowerCase().includes('air audit') && !filter.subService.toLowerCase().includes('rectification'))) {
      deletedAir = await this.prisma.airAuditCostingSheet.deleteMany({ where: auditWhere }).catch(() => ({ count: 0 }));
    }
    if (!filter.subService || filter.subService.toLowerCase().includes('energy audit')) {
      deletedEnergy = await this.prisma.energyAuditCostingSheet.deleteMany({ where: auditWhere }).catch(() => ({ count: 0 }));
    }

    return {
      deletedCount: (deletedCosting?.count || 0) + (deletedAir?.count || 0) + (deletedEnergy?.count || 0) + (deletedRect?.count || 0),
    };
  }

  async deleteAirAuditSheet(id: string) {
    return this.prisma.airAuditCostingSheet.delete({ where: { id } });
  }

  async deleteEnergyAuditSheet(id: string) {
    return this.prisma.energyAuditCostingSheet.delete({ where: { id } });
  }

  async deleteAirAuditRectificationSheet(id: string) {
    return this.prisma.airAuditRectificationCostingSheet.delete({ where: { id } });
  }

  // ─── DEDICATED AIR AUDIT FORMAT METHODS ─────────────────────────────────

  async saveAirAuditTemplate(dto: any, userId?: string) {
    const existing = await this.prisma.airAuditTemplate.findFirst();
    let template;
    if (existing) {
      template = await this.prisma.airAuditTemplate.update({
        where: { id: existing.id },
        data: {
          name: dto.name || 'Air Audit Master Template',
          manpowerRows: dto.manpowerRows,
          instrumentRows: dto.instrumentRows,
          extraExpenseRows: dto.extraExpenseRows,
          siteWorkingDays: dto.siteWorkingDays,
          reportWorkingDays: dto.reportWorkingDays,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    } else {
      template = await this.prisma.airAuditTemplate.create({
        data: {
          name: dto.name || 'Air Audit Master Template',
          manpowerRows: dto.manpowerRows,
          instrumentRows: dto.instrumentRows,
          extraExpenseRows: dto.extraExpenseRows,
          siteWorkingDays: dto.siteWorkingDays,
          reportWorkingDays: dto.reportWorkingDays,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    }
    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: existing ? 'UPDATE' : 'CREATE',
          entityType: 'AirAuditTemplate',
          entityId: template.id,
          details: { name: template.name },
        },
      }).catch(() => null);
    }
    return template;
  }

  async getAirAuditTemplate() {
    return this.prisma.airAuditTemplate.findFirst();
  }

  async saveAirAuditSheet(dto: any, userId?: string) {
    const dataObj = {
      clientName: dto.clientName,
      projectName: dto.projectName || null,
      siteName: dto.siteName || null,
      scopeDetails: dto.scopeDetails || null,
      manpowerRows: dto.manpowerRows,
      instrumentRows: dto.instrumentRows,
      extraExpenseRows: dto.extraExpenseRows,
      siteWorkingDays: dto.siteWorkingDays,
      reportWorkingDays: dto.reportWorkingDays,
      totalManpowerCost: dto.totalManpowerCost,
      totalInstrumentCost: dto.totalInstrumentCost,
      totalExtraCost: dto.totalExtraCost,
      subtotalCost: dto.subtotalCost,
      marginPct: dto.marginPct,
      marginAmount: dto.marginAmount,
      bufferPct: dto.bufferPct,
      bufferAmount: dto.bufferAmount,
      finalQuote: dto.finalQuote,
      status: dto.status || 'SAVED',
    };

    let sheet;
    if (dto.id) {
      sheet = await this.prisma.airAuditCostingSheet.update({
        where: { id: dto.id },
        data: dataObj,
      });
    } else {
      sheet = await this.prisma.airAuditCostingSheet.create({
        data: {
          ...dataObj,
          createdById: userId || null,
        },
      });
    }

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: dto.id ? 'UPDATE' : 'CREATE',
          entityType: 'AirAuditCostingSheet',
          entityId: sheet.id,
          details: { clientName: sheet.clientName, finalQuote: Number(sheet.finalQuote) },
        },
      }).catch(() => null);
    }
    return sheet;
  }

  async getAirAuditSheets(clientName?: string) {
    const where: any = {};
    if (clientName) {
      where.clientName = { contains: clientName, mode: 'insensitive' };
    }
    return this.prisma.airAuditCostingSheet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── DEDICATED ENERGY AUDIT FORMAT METHODS ──────────────────────────────

  async saveEnergyAuditTemplate(dto: any, userId?: string) {
    const existing = await this.prisma.energyAuditTemplate.findFirst();
    let template;
    if (existing) {
      template = await this.prisma.energyAuditTemplate.update({
        where: { id: existing.id },
        data: {
          name: dto.name || 'Energy Audit Master Template',
          manpowerRows: dto.manpowerRows,
          instrumentRows: dto.instrumentRows,
          extraExpenseRows: dto.extraExpenseRows,
          siteWorkingDays: dto.siteWorkingDays,
          reportWorkingDays: dto.reportWorkingDays,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    } else {
      template = await this.prisma.energyAuditTemplate.create({
        data: {
          name: dto.name || 'Energy Audit Master Template',
          manpowerRows: dto.manpowerRows,
          instrumentRows: dto.instrumentRows,
          extraExpenseRows: dto.extraExpenseRows,
          siteWorkingDays: dto.siteWorkingDays,
          reportWorkingDays: dto.reportWorkingDays,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    }
    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: existing ? 'UPDATE' : 'CREATE',
          entityType: 'EnergyAuditTemplate',
          entityId: template.id,
          details: { name: template.name },
        },
      }).catch(() => null);
    }
    return template;
  }

  async getEnergyAuditTemplate() {
    return this.prisma.energyAuditTemplate.findFirst();
  }

  async saveEnergyAuditSheet(dto: any, userId?: string) {
    const dataObj = {
      clientName: dto.clientName,
      projectName: dto.projectName || null,
      siteName: dto.siteName || null,
      scopeDetails: dto.scopeDetails || null,
      manpowerRows: dto.manpowerRows,
      instrumentRows: dto.instrumentRows,
      extraExpenseRows: dto.extraExpenseRows,
      siteWorkingDays: dto.siteWorkingDays,
      reportWorkingDays: dto.reportWorkingDays,
      totalManpowerCost: dto.totalManpowerCost,
      totalInstrumentCost: dto.totalInstrumentCost,
      totalExtraCost: dto.totalExtraCost,
      subtotalCost: dto.subtotalCost,
      marginPct: dto.marginPct,
      marginAmount: dto.marginAmount,
      bufferPct: dto.bufferPct,
      bufferAmount: dto.bufferAmount,
      finalQuote: dto.finalQuote,
      status: dto.status || 'SAVED',
    };

    let sheet;
    if (dto.id) {
      sheet = await this.prisma.energyAuditCostingSheet.update({
        where: { id: dto.id },
        data: dataObj,
      });
    } else {
      sheet = await this.prisma.energyAuditCostingSheet.create({
        data: {
          ...dataObj,
          createdById: userId || null,
        },
      });
    }

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: dto.id ? 'UPDATE' : 'CREATE',
          entityType: 'EnergyAuditCostingSheet',
          entityId: sheet.id,
          details: { clientName: sheet.clientName, finalQuote: Number(sheet.finalQuote) },
        },
      }).catch(() => null);
    }
    return sheet;
  }

  async getEnergyAuditSheets(clientName?: string) {
    const where: any = {};
    if (clientName) {
      where.clientName = { contains: clientName, mode: 'insensitive' };
    }
    return this.prisma.energyAuditCostingSheet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── DEDICATED AIR AUDIT RECTIFICATION FORMAT METHODS ───────────────────

  async saveAirAuditRectificationTemplate(dto: any, userId?: string) {
    const existing = await this.prisma.airAuditRectificationTemplate.findFirst();
    let template;
    if (existing) {
      template = await this.prisma.airAuditRectificationTemplate.update({
        where: { id: existing.id },
        data: {
          name: dto.name || 'Air Audit Rectification Master Template',
          manpowerRows: dto.manpowerRows,
          instrumentRows: dto.instrumentRows,
          extraExpenseRows: dto.extraExpenseRows,
          siteWorkingDays: dto.siteWorkingDays,
          reportWorkingDays: dto.reportWorkingDays,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    } else {
      template = await this.prisma.airAuditRectificationTemplate.create({
        data: {
          name: dto.name || 'Air Audit Rectification Master Template',
          manpowerRows: dto.manpowerRows,
          instrumentRows: dto.instrumentRows,
          extraExpenseRows: dto.extraExpenseRows,
          siteWorkingDays: dto.siteWorkingDays,
          reportWorkingDays: dto.reportWorkingDays,
          marginPct: dto.marginPct,
          bufferPct: dto.bufferPct,
        },
      });
    }
    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: existing ? 'UPDATE' : 'CREATE',
          entityType: 'AirAuditRectificationTemplate',
          entityId: template.id,
          details: { name: template.name },
        },
      }).catch(() => null);
    }
    return template;
  }

  async getAirAuditRectificationTemplate() {
    return this.prisma.airAuditRectificationTemplate.findFirst();
  }

  async saveAirAuditRectificationSheet(dto: any, userId?: string) {
    const dataObj = {
      clientName: dto.clientName,
      projectName: dto.projectName || null,
      siteName: dto.siteName || null,
      scopeDetails: dto.scopeDetails || null,
      manpowerRows: dto.manpowerRows,
      instrumentRows: dto.instrumentRows,
      extraExpenseRows: dto.extraExpenseRows,
      siteWorkingDays: dto.siteWorkingDays,
      reportWorkingDays: dto.reportWorkingDays,
      totalManpowerCost: dto.totalManpowerCost,
      totalInstrumentCost: dto.totalInstrumentCost,
      totalExtraCost: dto.totalExtraCost,
      subtotalCost: dto.subtotalCost,
      marginPct: dto.marginPct,
      marginAmount: dto.marginAmount,
      bufferPct: dto.bufferPct,
      bufferAmount: dto.bufferAmount,
      finalQuote: dto.finalQuote,
      status: dto.status || 'SAVED',
    };

    let sheet;
    if (dto.id) {
      sheet = await this.prisma.airAuditRectificationCostingSheet.update({
        where: { id: dto.id },
        data: dataObj,
      });
    } else {
      sheet = await this.prisma.airAuditRectificationCostingSheet.create({
        data: {
          ...dataObj,
          createdById: userId || null,
        },
      });
    }

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: dto.id ? 'UPDATE' : 'CREATE',
          entityType: 'AirAuditRectificationCostingSheet',
          entityId: sheet.id,
          details: { clientName: sheet.clientName, finalQuote: Number(sheet.finalQuote) },
        },
      }).catch(() => null);
    }
    return sheet;
  }

  async getAirAuditRectificationSheets(clientName?: string) {
    const where: any = {};
    if (clientName) {
      where.clientName = { contains: clientName, mode: 'insensitive' };
    }
    return this.prisma.airAuditRectificationCostingSheet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}


