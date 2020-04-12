export enum CardColor {
  Red = 'red',
  Green = 'green',
  Yellow = 'gold',
  Blue = 'blue',
}

export enum CardValue {
  Zero = '0',
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Reverse = '⇄',
  PlusTwo = '+2',
}

export interface CardInHand {
  color: CardColor;
  value: CardValue;
  isConcealed: boolean;
}

export type HiddenCard = null;

export interface CardInPile {
  color: CardColor;
  value: CardValue;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

interface BasePlayer {
  id: string;
  hasExitedGame: boolean;
}

export interface Opponent extends BasePlayer {
  cards: HiddenCard[];
  position: number;
}

export interface Player extends BasePlayer {
  cards: CardInHand[];
  position: number;
}

export interface GameState {
  opponents: Opponent[];
  player: Player;
  cardPile: CardInPile[];
  playerTurn: number;
  isReversePlayDirection: boolean;
}
