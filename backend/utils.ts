import { CardInHand, CardColor, CardValue, CardInPile } from "../frontend/src/types/commonTypes";
import { initialNumberOfCardsInHand } from "./constants";

export const getUserId = (connection):string => (connection as any).headers.cookie;

export const getUserIdsInChannel = (app, channel: string):string[] => {
  return app.channel(channel).connections.map(conn =>  conn.headers.cookie)
}

export const getOtherPlayersChannels = (app, userId: string) => {
  const otherPlayersChannels = app.channel(app.channels)
  .filter(connection => {
    const id = getUserId(connection)
    return id !== userId
  });
  return otherPlayersChannels;
}

export const getInitialHand = (isConcealed = true): CardInHand[] => {
  const initialHand: CardInHand[] = [];

  while (initialHand.length < initialNumberOfCardsInHand) {
    initialHand.push(getRandomCard(isConcealed));
  }

  return initialHand;
};

export const getRandomCard = (isConcealed = true): CardInHand => {
  return {
    color: randomEnum(CardColor),
    value: randomEnum(CardValue),
    isConcealed: isConcealed,
  };
};

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

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