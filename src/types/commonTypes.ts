import { CardColor, CardValue } from '../components/Card';

export interface CardInHand {
  color: CardColor;
  value: CardValue;
  isConcealed: boolean;
}

export enum TablePosition {
  OpponentRight,
  OpponentLeft,
  OpponentTop,
  Player,
}

interface Opponent {
  name: string;
  cards: CardInHand[];
  position: TablePosition;
}

interface Player {
  cards: CardInHand[];
}

export interface GameState {
  opponents: Opponent[];
  player: Player;
  topCard: CardInHand;
  playerTurn: number;
}
