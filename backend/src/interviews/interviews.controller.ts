import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('interviews')
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateInterviewDto) {
    return this.interviewsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.interviewsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }
}