import { Service } from '../../src/types/services';
import { ApiServer } from './ApiServer';
import { Room } from './rooms';
import { PlayerService } from './services/Player';
import { SystemEvent } from '../../src/types/serverEventTypes';
import { ClientEvent } from '../../src/types/clientEventTypes';

export type userId = string;

export default (api: ApiServer): void => {
  // Add any new real-time connection to the `everybody` channel
  api.on(SystemEvent.NewConnection, socket => {
    const userId: userId = socket.id;
    socket.join(Room.CardPile);
    console.log(`user ${userId} connected`);
    api.service<PlayerService>(Service.Player).addPlayer(userId, socket);

    socket.on(SystemEvent.ConnectionClosed, () => {
      console.log(`user ${userId} disconnected`);
      api.service<PlayerService>(Service.Player).removePlayer(userId);
    });

    socket.on(ClientEvent.PlaysCard, (cardIndex: number) => {
      console.log(`Player ${userId} played card with index`, cardIndex);
      api.service<PlayerService>(Service.Player).playCard(userId, cardIndex, socket);
    });

    socket.on(ClientEvent.PicksUpCard, () => {
      console.log(`Player ${userId} picked up card`);
      api.service<PlayerService>(Service.Player).PicksUpCard(userId);
    });
  });
};
