import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DealStage } from '../../generated/prisma';

export class CreateDealDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  value?: number;
}

export class UpdateDealDto {
  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsNumber()
  @IsOptional()
  @Min(0)
  value?: number;
}
