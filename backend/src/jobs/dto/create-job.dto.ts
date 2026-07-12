import { IsString, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  requirements: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  salary?: string;
}