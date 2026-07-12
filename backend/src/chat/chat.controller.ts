import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { messages: { role: string; content: string }[] }) {
    const reply = await this.chatService.getChatReply(body.messages);
    return { reply };
  }
}