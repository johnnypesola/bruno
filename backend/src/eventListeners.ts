import { ServiceName } from '../../src/types/services';
import { ApiServer } from './ApiServer';
import { SystemEvent, PlayerEvent } from '../../src/types/events';
import { Room } from './rooms';
import { PlayerService } from './services/Player';

export type userId = string;

export default (api: ApiServer): void => {
  // Add any new real-time connection to the `everybody` channel
  api.on(SystemEvent.NewConnection, socket => {
    const userId: userId = socket.id;
    socket.join(Room.CardPile);
    console.log(`user ${userId} connected`);
    api.service<PlayerService>(ServiceName.Player).addPlayer(userId, socket);

    socket.on(SystemEvent.ConnectionClosed, () => {
      console.log(`user ${userId} disconnected`);
      api.service<PlayerService>(ServiceName.Player).removePlayer(userId);
    });

    socket.on(PlayerEvent.PlaysCard, (cardIndex: number) => {
      console.log(`Player ${userId} played card with index`, cardIndex);
      api.service<PlayerService>(ServiceName.Player).playCard(userId, cardIndex, socket);
    });
  });

  // api.addEventListener(SystemEvent.ConnectionClosed, socket => {
  //   const userId = socket.id;
  //   console.log(`user ${userId} disconnected`);
  //   api.service<PlayerService>(ServiceName.Player).removePlayer(userId);
  // });

  // api.addEventListener(PlayerEvent.PlayCard, (socket,  => {
  // const userId = socket.id;
  // console.log(`Player played card`, socket);
  // api.service<PlayerService>(ServiceName.Player).removePlayer(userId);
  // });
};
