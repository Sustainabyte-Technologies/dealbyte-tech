import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProposalStatus } from '../../generated/prisma';

export class GenerateProposalDto {
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  proposalNumber?: string;

  @IsString()
  @IsOptional()
  proposalDate?: string;

  @IsString()
  @IsOptional()
  clientLogo?: string;

  @IsOptional()
  customContent?: any;

  @IsString()
  @IsOptional()
  scopeDetails?: string;
}

export class UpdateProposalStatusDto {
  @IsEnum(ProposalStatus)
  status: ProposalStatus;
}

export class UpdateProposalDto {
  @IsString()
  @IsOptional()
  proposalNumber?: string;

  @IsEnum(ProposalStatus)
  @IsOptional()
  status?: ProposalStatus;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  proposalDate?: string;

  @IsString()
  @IsOptional()
  clientLogo?: string;

  @IsOptional()
  customContent?: any;

  @IsString()
  @IsOptional()
  scopeDetails?: string;
}
