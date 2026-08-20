import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { ContentSection } from '../../generated/prisma';

export class CreateContentBlockDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsEnum(ContentSection)
  section: ContentSection;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  bodyText: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateContentBlockDto {
  @IsEnum(ContentSection)
  @IsOptional()
  section?: ContentSection;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  bodyText?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
