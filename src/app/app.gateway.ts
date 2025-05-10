import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AppService } from 'src/app.service';
import { Server, Socket } from 'socket.io';
import { Prisma } from 'generated/prisma';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: Prisma.ChatCreateInput,
  ): Promise<void> {
    await this.appService.createMessage(payload);
    /** Событие recMessage и объект ChatCreateInput отправляются всем подключенным к сокету. */
    this.server.emit('recMessage', payload);
  }

  afterInit(server: any) {
    console.log(server);
  }

  handleConnection(client: Socket) {
    console.log('connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected', client.id);
  }
}
