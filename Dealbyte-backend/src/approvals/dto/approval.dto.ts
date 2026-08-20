import { IsOptional, IsString } from 'class-validator';

export class ApproveRejectDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
