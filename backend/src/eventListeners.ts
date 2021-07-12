import { ApiServer } from './ApiServer';
import { Room } from './rooms';
import { SystemEvent } from '../../frontend/src/types/serverEventTypes';
import { ClientEvent } from '../../frontend/src/types/clientEventTypes';
import { Socket } from 'socket.io';

export type userId = string;

export default (api: ApiServer): void => {
  // Add any new real-time connection to the `everybody` channel
  api.on(SystemEvent.NewConnection, (socket: Socket) => {
    const userId: userId = socket.id;
    socket.join(Room.CardPile);
    console.log(`user ${userId} connected`);
    api.services.Player.addPlayer(userId, socket);

    socket.on(SystemEvent.ConnectionClosed, () => {
      console.log(`user ${userId} disconnected`);
      api.services.Player.removePlayer(userId);
    });

    socket.on(ClientEvent.PlayCard, (cardIndex: number) => {
      console.log(`Player ${userId} played card with index`, cardIndex);
      api.services.Player.playCard(userId, cardIndex);
    });

    socket.on(ClientEvent.PlaySelectedCards, () => {
      console.log(`Player ${userId} played selected cards`);
      api.services.Player.playSelectedCards(userId);
    });

    socket.on(ClientEvent.SelectCard, (cardIndex: number, isSelected: boolean) => {
      console.log(`Player ${userId} selected (${isSelected}) card with index`, cardIndex);
      api.services.Player.selectCard(userId, cardIndex, isSelected);
    });

    socket.on(ClientEvent.PickUpCard, () => {
      console.log(`Player ${userId} picked up card`);
      api.services.Player.picksUpCard(userId);
    });

    socket.on(ClientEvent.SelectCharacter, (characterId: number) => {
      console.log(`Player ${userId} selected character with id`, characterId);
      api.services.Player.selectCharacter(userId, characterId);
    });
  });
};
