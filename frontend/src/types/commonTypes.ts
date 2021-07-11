export enum CardColor {
  Red = '#C25',
  Green = 'green',
  Yellow = 'gold',
  Blue = 'blue',
}

export enum NumericCardValue {
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
}

export enum SpecialCardValue {
  PlusTwo = '✌️',
  Skip = '🚫',
  Reverse = '⇄',
}

export type CardValue = NumericCardValue | SpecialCardValue;

export interface CardInHand {
  color: CardColor;
  value: CardValue;
  isConcealed: boolean;
  isSelected: boolean;
  selectedOrder?: number;
}

export type CardInHandWithIndex = CardInHand & { index: number };

export type HiddenCard = Pick<CardInHand, 'isSelected'>;

export type GameStage = 'ended' | 'started' | 'characterSelection';

export interface CardInPile {
  color: CardColor;
  value: CardValue;
  rotation: number;
  offsetX: number;
  offsetY: number;
  isEffectConsumed?: true;
}

interface BasePlayer {
  id: string;
  hasExitedGame: boolean;
  characterId?: number;
}

export interface Opponent extends BasePlayer {
  cards: HiddenCard[];
  position?: number;
}

export interface Player extends BasePlayer {
  cards: CardInHand[];
  position?: number;
  isInitialized: boolean;
}

export interface Character {
  id: number;
  name: string;
}

export interface InitPlayerDataContent {
  gameStage: GameStage;
  newPlayer: Player;
  opponents: Opponent[];
  playerTurnPosition: number;
  cardsInPile: CardInPile[];
}

export interface GameState {
  gameStage: GameStage;
  opponents: Opponent[];
  player: Player;
  cardPile: CardInPile[];
  playerTurn: number;
  isReversePlayDirection: boolean;
  toasterMessage?: string;
  dialogMessage?: string;
}

export type Coords = { x: number; y: number };
