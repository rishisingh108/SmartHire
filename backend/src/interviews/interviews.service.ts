import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class InterviewsService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async create(dto: CreateInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: {
        candidate: true,
        job: { include: { company: true } },
      },
    });

    if (!application) throw new NotFoundException('Application not found');

    // Updated: Now calling the Jitsi room generator
    const room = this.createJitsiRoom(dto.applicationId);

    const interview = await this.prisma.interview.create({
      data: {
        applicationId: dto.applicationId,
        roomUrl: room.url,
        scheduledAt: new Date(dto.scheduledAt),
      },
      include: {
        application: {
          include: {
            candidate: true,
            job: { include: { company: true } },
          },
        },
      },
    });

    await this.prisma.application.update({
      where: { id: dto.applicationId },
      data: { status: 'INTERVIEW' },
    });

    await this.sendInterviewEmail(
      application.candidate.email,
      application.candidate.name,
      application.job.title,
      room.url,
      dto.scheduledAt,
    );

    return interview;
  }

  async findAll() {
    return this.prisma.interview.findMany({
      include: {
        application: {
          include: {
            candidate: {
              select: { id: true, name: true, email: true },
            },
            job: { select: { title: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            candidate: {
              select: { id: true, name: true, email: true },
            },
            job: { include: { company: true } },
          },
        },
      },
    });
    if (!interview) throw new NotFoundException('Interview not found');
    return interview;
  }

  // Updated: Replaced createDailyRoom with synchronous Jitsi generator
  private createJitsiRoom(interviewId: string) {
    const roomName = `smarthire-${interviewId}-${Date.now()}`;
    const roomUrl = `https://meet.jit.si/${roomName}`;
    
    console.log('Jitsi room created:', roomUrl);
    return { url: roomUrl };
  }

  private async sendInterviewEmail(
    email: string,
    name: string,
    jobTitle: string,
    roomUrl: string,
    scheduledAt: string,
  ) {
    const date = new Date(scheduledAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    await this.transporter.sendMail({
      from: `SmartHire <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Interview Scheduled — ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4C3FA0;">Interview Scheduled! 🎉</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your interview for <strong>${jobTitle}</strong> has been scheduled.</p>
          <p><strong>Date & Time:</strong> ${date} (IST)</p>
          <div style="margin: 24px 0;">
            <a href="${roomUrl}"
               style="background: #4C3FA0; color: white; padding: 12px 24px;
                      border-radius: 6px; text-decoration: none; font-weight: bold;">
              Join Interview
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Please join 5 minutes before the scheduled time.<br/>
            Make sure your camera and microphone are working.
          </p>
          <p>Best of luck! 🚀</p>
          <p>— SmartHire Team</p>
        </div>
      `,
    });

    console.log(`Interview email sent to ${email}`);
  }
}