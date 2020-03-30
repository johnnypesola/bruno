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
  topCard: CardInHand;
  playerTurn: number;
}
