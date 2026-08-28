import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty, IsBoolean } from 'class-validator';

export class SaveCostingTemplateDto {
  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  stationType?: string;

  @IsOptional()
  @IsString()
  outstationStartLocation?: string;

  @IsOptional()
  @IsString()
  outstationEndLocation?: string;

  @IsOptional()
  @IsArray()
  manpowerRows?: any[];

  @IsOptional()
  @IsArray()
  instrumentRows?: any[];

  @IsOptional()
  @IsArray()
  extraExpenseRows?: any[];

  @IsOptional()
  extraExpenses?: any;

  @IsOptional()
  @IsNumber()
  siteWorkingDays?: number;

  @IsOptional()
  @IsNumber()
  reportWorkingDays?: number;

  @IsNumber()
  marginPct: number;

  @IsNumber()
  bufferPct: number;

  @IsOptional()
  @IsBoolean()
  isEms?: boolean;

  @IsOptional()
  @IsArray()
  emsHardwareRows?: any[];

  @IsOptional()
  @IsArray()
  emsGatewayHardwareRows?: any[];

  @IsOptional()
  @IsArray()
  emsElectricalHardwareRows?: any[];

  @IsOptional()
  @IsArray()
  emsManpowerRows?: any[];

  @IsOptional()
  @IsArray()
  emsPlatformRows?: any[];

  @IsOptional()
  @IsArray()
  emsRecurringRows?: any[];

  @IsOptional()
  @IsBoolean()
  isIotControls?: boolean;

  @IsOptional()
  @IsArray()
  iotControlsHardwareRows?: any[];

  @IsOptional()
  @IsArray()
  iotControlsMandaysRows?: any[];

  @IsOptional()
  @IsArray()
  iotControlsTravelRows?: any[];

  @IsOptional()
  @IsArray()
  iotControlsOpexRows?: any[];

  @IsOptional()
  iotControlsRoiState?: any;

  @IsOptional()
  @IsBoolean()
  isWeldingIot?: boolean;

  @IsOptional()
  @IsArray()
  weldingHardwareRows?: any[];

  @IsOptional()
  @IsArray()
  weldingSoftwareRows?: any[];

  @IsOptional()
  @IsArray()
  weldingCloudRows?: any[];

  @IsOptional()
  @IsArray()
  weldingInstallationRows?: any[];

  @IsOptional()
  @IsBoolean()
  isCpm?: boolean;

  @IsOptional()
  @IsArray()
  cpmHardwareRows?: any[];

  @IsOptional()
  @IsArray()
  cpmElectricalRows?: any[];

  @IsOptional()
  @IsArray()
  cpmCommissioningManpowerRows?: any[];

  @IsOptional()
  @IsArray()
  cpmInstallationRows?: any[];

  @IsOptional()
  @IsArray()
  cpmInstallationManpowerRows?: any[];

  @IsOptional()
  @IsArray()
  cpmCloudRows?: any[];

  @IsOptional()
  @IsNumber()
  roundingNearest?: number;
}
