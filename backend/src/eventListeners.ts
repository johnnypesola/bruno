import { ServiceName } from '../../src/types/services';
import { ApiServer } from './ApiServer';
import { SystemEvent } from '../../src/types/events';
import { Room } from './rooms';
import { PlayerService } from './services/Player';

export default (api: ApiServer): void => {
  // Add any new real-time connection to the `everybody` channel
  api.addEventListener(SystemEvent.NewConnection, socket => {
    const userId = socket.id;
    socket.join(Room.CardPile);
    console.log(`user ${userId} connected`);
    api.service<PlayerService>(ServiceName.Player).addPlayer(userId);
  });

  api.addEventListener(SystemEvent.ConnectionClosed, socket => {
    const userId = socket.id;
    console.log(`user ${userId} disconnected`);
    api.service<PlayerService>(ServiceName.Player).removePlayer(userId);
  });
};
