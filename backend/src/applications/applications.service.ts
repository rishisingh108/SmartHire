import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    @InjectQueue('resume-screening') private screeningQueue: Queue,
  ) {}

  async apply(dto: CreateApplicationDto, candidateId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
    });
    if (!job) throw new NotFoundException('Job not found');

    const existing = await this.prisma.application.findFirst({
      where: { jobId: dto.jobId, candidateId },
    });
    if (existing) throw new ConflictException('Already applied to this job');

    const application = await this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        candidateId,
        resumeUrl: dto.resumeUrl,
        resumeText: dto.resumeText,
      },
      include: {
        job: { include: { company: true } },
        candidate: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (dto.resumeText) {
      await this.screeningQueue.add('screen', {
        applicationId: application.id,
        resumeText: dto.resumeText,
        jobDescription: `${job.title} - ${job.description} - ${job.requirements}`,
      });
      console.log(`Resume screening queued for: ${application.id}`);
    }

    return application;
  }

  async findByCandidate(candidateId: string) {
    return this.prisma.application.findMany({
      where: { candidateId },
      include: {
        job: { include: { company: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJob(jobId: string) {
    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { aiScore: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.application.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async searchCandidates(query: string) {
    if (!query) return [];

    // Pinecone se semantic search
    const results = await this.aiService.searchCandidates(query);

    // DB se candidate details fetch karo
    const candidateIds = results.map((r) => r.candidateId);
    const candidates = await this.prisma.user.findMany({
      where: { id: { in: candidateIds } },
      select: {
        id: true,
        name: true,
        email: true,
        applications: {
          select: {
            aiScore: true,
            aiSkills: true,
            aiSummary: true,
            status: true,
            job: { select: { title: true } },
          },
          orderBy: { aiScore: 'desc' },
          take: 1,
        },
      },
    });

    return candidates.map((c) => ({
      ...c,
      semanticScore: results.find((r) => r.candidateId === c.id)?.score,
    }));
  }
}