import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server!: Server;
  private users: Map<number, string> = new Map();


  public handleConnection(client: Socket, ...args: any[]) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.users.set(userId, client.id);
    }
  }


  public handleDisconnect(client: Socket) {
    this.users.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.users.delete(userId);
      }
    });
  }


  public emit<T>(userId: number, event: string, payload: T): void {
    const socketId = this.users.get(userId);
    if (socketId && this.server.sockets.sockets.get(socketId)) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}