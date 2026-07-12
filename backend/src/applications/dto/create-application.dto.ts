import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsUUID()
  jobId: string;

  @IsString()
  resumeUrl: string;

  @IsString()
  @IsOptional()
  resumeText?: string;
}