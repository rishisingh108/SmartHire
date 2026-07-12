import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { CompaniesModule } from './companies/companies.module';
import { UploadModule } from './upload.module';
import { AiModule } from './ai/ai.module';
import { InterviewsModule } from './interviews/interviews.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    JobsModule,
    ApplicationsModule,
    CompaniesModule,
    UploadModule,
    AiModule,
    InterviewsModule,
    ChatModule,
  ],
})
export class AppModule {}