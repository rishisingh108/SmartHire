import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateJobDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user?.companyId) {
      throw new ForbiddenException('You must belong to a company to post jobs');
    }

    return this.prisma.job.create({
      data: {
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        location: dto.location,
        salary: dto.salary,
        companyId: user.companyId,
      },
      include: { company: true },
    });
  }

  async findAll() {
    return this.prisma.job.findMany({
      where: { isActive: true },
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
    });

    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async remove(id: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { company: { include: { users: true } } },
    });

    if (!job) throw new NotFoundException('Job not found');

    const isOwner = job.company.users.some((u) => u.id === userId);
    if (!isOwner) throw new ForbiddenException('Not allowed');

    return this.prisma.job.update({
      where: { id },
      data: { isActive: false },
    });
  }
}