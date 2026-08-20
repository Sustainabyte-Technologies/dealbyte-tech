import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';

// ─── Manpower ────────────────────────────────────────────────────────────────

export class CreateManpowerRateDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @Min(0)
  ratePerDay: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;
}

export class UpdateManpowerRateDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ratePerDay?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;
}

// ─── Instruments ─────────────────────────────────────────────────────────────

export class CreateInstrumentRateDto {
  @IsString()
  @IsNotEmpty()
  instrumentName: string;

  @IsNumber()
  @Min(0)
  rentalRatePerDay: number;

  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;
}

export class UpdateInstrumentRateDto {
  @IsString()
  @IsOptional()
  instrumentName?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rentalRatePerDay?: number;

  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;
}

// ─── Hardware ────────────────────────────────────────────────────────────────

export class CreateHardwareItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  unitCost: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}

export class UpdateHardwareItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitCost?: number;

  @IsString()
  @IsOptional()
  category?: string;
}
