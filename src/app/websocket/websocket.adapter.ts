import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { ServerConfig } from "../config/config.interface";


export class SocketIoAdapter extends IoAdapter {

  constructor(
    app: INestApplicationContext,
    private readonly config: ServerConfig) {

    super(app);
  }


  public createIOServer(port: number, options: ServerOptions) {
    options.cors = this.config.cors;

    return super.createIOServer(port, options);
  }
}