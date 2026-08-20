import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── Sub-DTOs for quote line items ──────────────────────────────────────────

export class QuoteTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  manpowerRateId: string;

  @IsNumber()
  @Min(0)
  siteDays: number;

  @IsNumber()
  @Min(0)
  reportDays: number;
}

export class QuoteInstrumentDto {
  @IsString()
  @IsNotEmpty()
  instrumentRateId: string;

  @IsNumber()
  @Min(0)
  siteDays: number;
}

export class QuoteHardwareDto {
  @IsString()
  @IsNotEmpty()
  hardwareItemId: string;

  @IsNumber()
  @Min(1)
  qty: number;
}

// ─── Create Quote ───────────────────────────────────────────────────────────

export class CreateQuoteDto {
  @IsString()
  @IsOptional()
  dealId?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  proposalNumber?: string;

  @IsString()
  @IsOptional()
  proposalDate?: string;

  @IsString()
  @IsOptional()
  clientLogo?: string;

  @IsNumber()
  @Min(1)
  siteDays: number;

  @IsNumber()
  @Min(0)
  reportDays: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteTeamMemberDto)
  teamMembers: QuoteTeamMemberDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteInstrumentDto)
  @IsOptional()
  instruments?: QuoteInstrumentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteHardwareDto)
  @IsOptional()
  hardware?: QuoteHardwareDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  travelKms?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  travelRatePerKm?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  foodRatePerPersonDay?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  foodTravelCost?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  marginPct?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  bufferPct?: number;

  @IsArray()
  @IsOptional()
  lineItems?: any[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  finalQuote?: number;
}

// ─── Update Quote ───────────────────────────────────────────────────────────

export class UpdateQuoteDto {
  @IsString()
  @IsOptional()
  dealId?: string;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  proposalNumber?: string;

  @IsString()
  @IsOptional()
  proposalDate?: string;

  @IsString()
  @IsOptional()
  clientLogo?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  siteDays?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reportDays?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteTeamMemberDto)
  @IsOptional()
  teamMembers?: QuoteTeamMemberDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteInstrumentDto)
  @IsOptional()
  instruments?: QuoteInstrumentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteHardwareDto)
  @IsOptional()
  hardware?: QuoteHardwareDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  travelKms?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  travelRatePerKm?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  foodRatePerPersonDay?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  foodTravelCost?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  marginPct?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  bufferPct?: number;

  @IsArray()
  @IsOptional()
  lineItems?: any[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  finalQuote?: number;
}

// ─── Negotiate ──────────────────────────────────────────────────────────────

export class NegotiateQuoteDto {
  @IsNumber()
  @Min(0)
  negotiationMarginPct: number;
}
