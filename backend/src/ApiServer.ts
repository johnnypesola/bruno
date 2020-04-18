import express from 'express';
import socketIo, { Namespace } from 'socket.io';
import { createServer, Server } from 'http';
import { ServiceType } from './services';
import { ServiceName } from '../../src/types/services';
import { ApiEvent, GameStateAction } from '../../src/types/serverEventTypes';
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

  public on(event: ApiEvent, callback: (any) => void): socketIo.Namespace {
    console.log('Added eventlistener for ', event);
    return this.io.on(event, callback);
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

  public typedEmit({ name, value }: GameStateAction, socket: any = this.io): void {
    socket.emit(name, value);
  }
  public typedBroadcastEmit({ name, value }: GameStateAction, socket: any): void {
    socket.broadcast.emit(name, value);
  }

  get app(): express.Application {
    return this._app;
  }
}
