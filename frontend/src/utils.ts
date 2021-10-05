import { CardInHand, CardInPile, SpecialCardValue, NumericCardValue, CommonCardColor } from './types/commonTypes';

const initialNumberOfCardsInHand = 7;

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

export function enumAsValues<T>(anEnum: T): T[keyof T][] {
  return Object.values(anEnum) as unknown as T[keyof T][];
}

export const getRandomCard = (isConcealed = true): CardInHand => {
  return {
    color: randomEnum(CommonCardColor),
    value: randomEnum({ ...SpecialCardValue, ...NumericCardValue }),
    isConcealed: isConcealed,
    isSelected: false,
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

export const getTopCard = (cards: CardInPile[]): CardInPile => cards[cards.length - 1];

export const doCardsMatch = (card1: CardInHand | CardInPile, card2: CardInHand | CardInPile): boolean =>
  card1.color === card2.color || card1.value === card2.value;
