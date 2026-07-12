import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'resume-screening',
    }),
    AiModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}