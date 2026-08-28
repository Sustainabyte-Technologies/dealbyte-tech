import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty, IsBoolean } from 'class-validator';

export class SaveCostingSheetDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  serviceCategory: string;

  @IsString()
  @IsNotEmpty()
  subService: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsString()
  scopeDetails?: string;

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
  @IsNumber()
  travelDistanceKms?: number;

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

  @IsOptional()
  @IsNumber()
  totalManpowerCost?: number;

  @IsOptional()
  @IsNumber()
  totalInstrumentCost?: number;

  @IsOptional()
  @IsNumber()
  totalExtraCost?: number;

  @IsNumber()
  subtotalCost: number;

  @IsNumber()
  marginPct: number;

  @IsOptional()
  @IsNumber()
  marginAmount?: number;

  @IsNumber()
  bufferPct: number;

  @IsOptional()
  @IsNumber()
  bufferAmount?: number;

  @IsNumber()
  finalQuote: number;

  @IsOptional()
  @IsString()
  status?: string;

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
