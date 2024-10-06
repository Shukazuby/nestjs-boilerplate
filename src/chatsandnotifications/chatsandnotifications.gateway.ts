import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatsandnotificationsService } from './chatsandnotifications.service';
import { CreateChatsandnotificationDto } from './dto/chatsandnotification.dto';
import { UpdateChatsandnotificationDto } from './dto/update-chatsandnotification.dto';
import { Server, Socket } from 'socket.io';
import { CreateChatsDto, GetChatsDto } from './dto/chat.dto';
import { CreateNotificationDto } from './dto/notification.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsandnotificationsGateway {
  constructor(private readonly chatsandnotificationsService: ChatsandnotificationsService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket): void {
    // Handle client connection
    const userId = client.handshake.query.userId;
    client.join(userId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateChatsDto,
  ): Promise<void> {
    // Handle the incoming message and send it to the recipient
    const { receiver, sender } = payload;
    const savedchat = await this.chatsandnotificationsService.sendChat(payload);
    // Send the message to the recipient's room
    this.server.to(receiver).emit('newMessage', payload);
  }

  @SubscribeMessage('findAllMessage')
  async findallMessage(@MessageBody() payload: GetChatsDto): Promise<any> {
    const allChats = this.chatsandnotificationsService.getConversation(payload);
    return allChats;
  }
  // You can add more methods here for handling various WebSocket events
}
