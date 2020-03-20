import { initialNumberOfCardsInHand } from './constants';
import { CardColor, CardValue } from './components/Card';
import { CardInHand } from './types/commonTypes';

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

export const getRandomCard = (): CardInHand => {
  return { color: randomEnum(CardColor), value: randomEnum(CardValue) };
};

export const getInitialHand = (): CardInHand[] => {
  const initialHand: CardInHand[] = [];

  while (initialHand.length < initialNumberOfCardsInHand) {
    initialHand.push(getRandomCard());
  }

  return initialHand;
};

export const doCardsMatch = (card1: CardInHand, card2: CardInHand): boolean =>
  card1.color === card2.color || card1.value === card2.value;
