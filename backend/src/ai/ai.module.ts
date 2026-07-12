import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AiService } from './ai.service';
import { ResumeProcessor } from './processors/resume.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'resume-screening',
    }),
  ],
  providers: [AiService, ResumeProcessor],
  exports: [AiService, BullModule],
})
export class AiModule {}