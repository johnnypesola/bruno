import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { ServicesReadonlyMap } from '../../frontend/src/types/services';
import { ApiEvent, GameStateAction } from '../../frontend/src/types/serverEventTypes';
import { Player } from '../../frontend/src/types/commonTypes';
import { PlayerService } from './services/Player';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameService } from './services/Game';
import { CardPileService } from './services/CardPile';
import { CardEffectService } from './services/CardEffect';

export class ApiServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: HttpServer;
  private io: Server;
  private port: string | number;
  public readonly services: ServicesReadonlyMap;

  constructor() {
    this._app = express();
    this.port = process.env.PORT || ApiServer.PORT;
    this.server = createServer(this._app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
      },
    });

    this.services = {
      Game: new GameService(this),
      CardPile: new CardPileService(this),
      Player: new PlayerService(this),
      CardEffect: new CardEffectService(this),
    };

    this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`);
    });
  }

  public on(
    event: ApiEvent,
    callback: (any: Socket) => void,
  ): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {
    console.log('Added eventlistener for ', event);
    return this.io.on(event, callback);
  }

  public emit(event: ApiEvent, data: unknown): boolean {
    return this.io.emit(event, data);
  }

  public sendToSocket({ name, value }: GameStateAction, socket: Socket): void {
    socket.emit(name, value);
  }

  public sendToAllSockets({ name, value }: GameStateAction): void {
    this.io.emit(name, value);
  }

  public sendToOtherSockets({ name, value }: GameStateAction, socket: Socket): void {
    socket.broadcast.emit(name, value);
  }

  public sendToPlayer({ name, value }: GameStateAction, player: Player): void {
    this.io.to(player.id).emit(name, value);
  }

  public sendToOtherPlayers({ name, value }: GameStateAction, player: Player): void {
    const socket = this.services.Player.getSocketForPlayer(player);
    socket.broadcast.emit(name, value);
  }

  get app(): express.Application {
    return this._app;
  }
}
