import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  apply(@Body() dto: CreateApplicationDto, @Request() req: any) {
    return this.applicationsService.apply(dto, req.user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  myApplications(@Request() req: any) {
    return this.applicationsService.findByCandidate(req.user.id);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  byJob(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchCandidates(@Query('q') query: string) {
    return this.applicationsService.searchCandidates(query);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.applicationsService.updateStatus(id, status);
  }
}