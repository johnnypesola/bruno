import express from 'express';
import socketIo from 'socket.io';
import { createServer, Server } from 'http';
import { ApiEvent } from '../../src/types/events';
import { ServiceType } from './services';
import { ServiceName } from '../../src/types/services';
// eslint-disable-next-line
const cors = require('cors');

export class ApiServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private services: { name: ServiceName; instance: ServiceType } | {};

  constructor() {
    this._app = express();
    this.port = process.env.PORT || ApiServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.io = socketIo(this.server);

    this.services = {};

    this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`);
    });
  }

  public addEventListener(event: ApiEvent, callback: (any) => void): void {
    this.io.on(event, callback);
  }

  public addService(name: ServiceName, instance: ServiceType): void {
    this.services[name] = instance;
  }

  public service<T>(name: ServiceName): T {
    const instance = this.services[name];
    if (!instance) throw new Error(`No service instance found for: ${name}`);
    return instance;
  }

  public emit(event: ApiEvent, data: any): socketIo.Namespace {
    return this.io.emit(event, data);
  }

  // this.io.on(ChatEvent.CONNECT, (socket: any) => {
  //   console.log('Connected client on port %s.', this.port);

  //   socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
  //     console.log('[server](message): %s', JSON.stringify(m));
  //     this.io.emit('message', m);
  //   });

  //   socket.on(ChatEvent.DISCONNECT, () => {
  //     console.log('Client disconnected');
  //   });
  // });

  get app(): express.Application {
    return this._app;
  }
}
