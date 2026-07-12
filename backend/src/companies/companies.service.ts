import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto, userId: string) {
    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        website: dto.website,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: company.id },
    });

    return company;
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true },
        },
        jobs: {
          where: { isActive: true },
        },
      },
    });

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, dto: CreateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data: {
        name: dto.name,
        website: dto.website,
      },
    });
  }
}
