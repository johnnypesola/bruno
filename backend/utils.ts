import { CardInHand, CardColor, CardValue, CardInPile } from '../src/types/commonTypes';
import { initialNumberOfCardsInHand } from './constants';
import { RealTimeConnection, Channel } from '@feathersjs/transport-commons/lib/channels/channel/base.d.ts';
import { Api } from './Api';

export const getUserId = (connection: RealTimeConnection): string => connection.headers.cookie;

export const getUserIdsInChannel = (app, channel: string): string[] => {
  return app.channel(channel).connections.map(conn => conn.headers.cookie);
};

export const getOtherPlayersChannels = (app: Api, userId: string): Channel => {
  const otherPlayersChannels = app.channel(app.channels).filter(connection => {
    const id = getUserId(connection);
    return id !== userId;
  });
  return otherPlayersChannels;
};

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

export const getRandomCard = (isConcealed = true): CardInHand => {
  return {
    color: randomEnum(CardColor),
    value: randomEnum(CardValue),
    isConcealed: isConcealed,
  };
};

export const getInitialHand = (isConcealed = true): CardInHand[] => {
  const initialHand: CardInHand[] = [];

  while (initialHand.length < initialNumberOfCardsInHand) {
    initialHand.push(getRandomCard(isConcealed));
  }

  return initialHand;
};

export const toPileCard = (card: CardInHand): CardInPile => {
  const randomRotation = Math.floor(Math.random() * 360);
  const randomOffsetX = Math.floor(Math.random() * 50) - 25;
  const randomOffsetY = Math.floor(Math.random() * 50) - 25;
  return {
    ...card,
    rotation: randomRotation,
    offsetX: randomOffsetX,
    offsetY: randomOffsetY,
  };
};
