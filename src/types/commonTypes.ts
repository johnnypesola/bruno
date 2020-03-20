import { CardColor, CardValue } from '../components/Card';

export interface CardInHand {
  color: CardColor;
  value: CardValue;
}

interface Opponent {
  name: string;
  cards: CardInHand[];
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
