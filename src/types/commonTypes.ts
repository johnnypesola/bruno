import { CardColor, CardValue } from '../components/Card';

export interface CardInHand {
  color: CardColor;
  value: CardValue;
  isConcealed: boolean;
}

export interface CardInPile {
  color: CardColor;
  value: CardValue;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export enum TablePosition {
  OpponentRight,
  OpponentLeft,
  OpponentTop,
  Player,
}

interface BasePlayer {
  cards: CardInHand[];
  hasExitedGame: boolean;
}

interface Opponent extends BasePlayer {
  name: string;
  position: TablePosition;
}

type Player = BasePlayer;

export interface GameState {
  opponents: Opponent[];
  player: Player;
  cardPile: CardInPile[];
  playerTurn: number;
  isReversePlayDirection: boolean;
}
