import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getChatReply(messages: { role: string; content: string }[]) {
    const systemPrompt = `You are SmartHire's helpful AI assistant on the landing page. SmartHire is an AI-powered recruitment platform built with Next.js 14, NestJS, PostgreSQL, Redis, GPT-4o resume screening, Pinecone vector search, Jitsi video interviews, and BullMQ. Pricing: Basic (free, 3 jobs), Pro (₹2,999/mo, unlimited), Enterprise (custom). Keep answers concise and friendly. If asked about technical stack, mention the tech. Always encourage users to sign up.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        })),
      ],
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not process that. Please try again.';
  }
}