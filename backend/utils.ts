import { CardInHand, CardColor, CardValue, CardInPile, Player, Opponent } from '../src/types/commonTypes';
import { initialNumberOfCardsInHand } from '../src/constants';

export const getUserIdsInChannel = (app, channel: string): string[] => {
  return app.channel(channel).connections.map(conn => conn.headers.cookie);
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

export const toOpponent = (player: Player): Opponent => {
  return {
    ...player,
    cards: player.cards.map(() => null),
  };
};
