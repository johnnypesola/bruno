import express from 'express';
import { Server } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { ServiceType } from './services';
import { Service } from '../../src/types/services';
import { ApiEvent, GameStateAction } from '../../src/types/serverEventTypes';
import { Player } from '../../src/types/commonTypes';
import { PlayerService } from './services/Player';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export class ApiServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: HttpServer;
  private io: Server;
  private port: string | number;
  private services: { name: Service; instance: ServiceType } | {};

  constructor() {
    this._app = express();
    this.port = process.env.PORT || ApiServer.PORT;
    this.server = createServer(this._app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
      },
    });

    this.services = {};

    this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`);
    });
  }

  public on(event: ApiEvent, callback: (any) => void): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {
    console.log('Added eventlistener for ', event);
    return this.io.on(event, callback);
  }

  public addService(name: Service, instance: ServiceType): void {
    this.services[name] = instance;
  }

  public service<T>(name: Service): T {
    const instance = this.services[name];
    if (!instance) throw new Error(`No service instance found for: ${name}`);
    return instance;
  }

  public emit(event: ApiEvent, data: any): boolean {
    return this.io.emit(event, data);
  }

  public sendToSocket({ name, value }: GameStateAction, socket: any): void {
    socket.emit(name, value);
  }

  public sendToAllSockets({ name, value }: GameStateAction): void {
    this.io.emit(name, value);
  }

  public sendToOtherSockets({ name, value }: GameStateAction, socket: any): void {
    socket.broadcast.emit(name, value);
  }

  public sendToPlayer({ name, value }: GameStateAction, player: Player): void {
    this.io.to(player.id).emit(name, value);
  }

  public sendToOtherPlayers({ name, value }: GameStateAction, player: Player): void {
    const socket = this.service<PlayerService>(Service.Player).getSocketForPlayer(player);
    socket.broadcast.emit(name, value);
  }

  get app(): express.Application {
    return this._app;
  }
}
