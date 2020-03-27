import { initialNumberOfCardsInHand } from './constants';
import Card, { CardColor, CardValue } from './components/Card';
import { CardInHand } from './types/commonTypes';

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

export function shuffle<T>(array: T[]): T[] {
  let newArray = Object.assign([], array) as T[];
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }
  return newArray;
}

export const getRandomCard = (isConcealed = true): CardInHand => {
  return {
    color: randomEnum(CardColor),
    value: randomEnum(CardValue),
    isConcealed: isConcealed,
  };
};

export const removeCardFromHand = (hand: CardInHand[], cardIndex: number): CardInHand[] => {
  return hand.filter((card, index) => index !== cardIndex);
};

export const removeTopCardFromDeck = (deck: CardInHand[]): CardInHand[] => {
  return deck.filter((card, index) => index !== 0);
};

export const getTopCardInDeck = (deck: CardInHand[]): CardInHand => {
  return deck[0];
};

export const getShuffledDeck = (): CardInHand[] => {
  let cardValues = [CardValue.Zero] as CardValue[]; // Uno deck contains one zero card of each color
  cardValues.push(...(Array.from({ length: 9 }, (v, k) => Object.values(CardValue)[k + 1]) as CardValue[])); // ...and two times 9 cards of each color
  cardValues.push(...(Array.from({ length: 9 }, (v, k) => Object.values(CardValue)[k + 1]) as CardValue[]));
  let cards = [] as CardInHand[];
  for (let index = 0; index < 4; index++) {
    for (const key in cardValues) {
      if (cardValues.hasOwnProperty(key)) {
        cards.push({ color: Object.values(CardColor)[index], value: cardValues[key], isConcealed: true });
      }
    }
  }
  return shuffle(cards);
};

export const getInitialHand = (isConcealed = true): CardInHand[] => {
  const initialHand: CardInHand[] = [];

  while (initialHand.length < initialNumberOfCardsInHand) {
    initialHand.push(getRandomCard(isConcealed));
  }

  return initialHand;
};

export const doCardsMatch = (card1: CardInHand, card2: CardInHand): boolean =>
  card1.color === card2.color || card1.value === card2.value;
