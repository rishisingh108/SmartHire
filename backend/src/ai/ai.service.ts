import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pdfParse = require('pdf-parse');

@Injectable()
export class AiService {
  private openai: OpenAI;
  private pinecone: Pinecone;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }

  async screenResume(resumeText: string, jobDescription: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert HR recruiter. Analyze resumes and return ONLY valid JSON.`,
        },
        {
          role: 'user',
          content: `
            Job Description: ${jobDescription}
            Resume: ${resumeText}
            
            Return ONLY this JSON:
            {
              "score": <number 0-100>,
              "summary": "<2-3 sentence summary>",
              "skills": ["skill1", "skill2"],
              "gaps": ["gap1", "gap2"],
              "recommendation": "hire" | "maybe" | "reject"
            }
          `,
        },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content!);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000),
    });
    return response.data[0].embedding;
  }

  async storeCandidateEmbedding(
    candidateId: string,
    resumeText: string,
    metadata: {
      name: string;
      email: string;
      skills: string[];
      score: number;
    },
  ) {
    const embedding = await this.generateEmbedding(resumeText);
    const index = this.pinecone.index(process.env.PINECONE_INDEX!);

    await (index as any).upsert({
      vectors: [
        {
          id: candidateId,
          values: embedding,
          metadata: {
            name: metadata.name,
            email: metadata.email,
            skills: metadata.skills.join(', '),
            score: metadata.score,
          },
        },
      ],
    });

    return { success: true, candidateId };
  }

  async searchCandidates(query: string, topK: number = 10) {
    const queryEmbedding = await this.generateEmbedding(query);
    const index = this.pinecone.index(process.env.PINECONE_INDEX!);

    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return results.matches.map((match) => ({
      candidateId: match.id,
      score: match.score,
      name: match.metadata?.name,
      email: match.metadata?.email,
      skills: match.metadata?.skills,
      aiScore: match.metadata?.score,
    }));
  }

  async generateInterviewQuestions(jobTitle: string, skills: string[]) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `
            Generate 5 technical interview questions for a ${jobTitle} role.
            Focus on these skills: ${skills.join(', ')}.
            Return ONLY this JSON:
            {
              "questions": [
                { "question": "...", "difficulty": "easy|medium|hard" }
              ]
            }
          `,
        },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content!);
  }
}