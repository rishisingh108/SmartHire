import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @IsUUID()
  applicationId: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  @IsOptional()
  notes?: string;
}