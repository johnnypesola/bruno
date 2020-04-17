import { Opponent, Player, CardInHand, CardInPile } from './commonTypes';

export enum Action {
  InitPlayer,
  AddOpponent,
  AddOpponents,
  RemoveOpponent,
  UpdateOpponent,
  PlayerPlaysCard,
  OpponentPlaysCard,
  OpponentDrawsCard,
  PlayerDrawsNewCard,
  SetPlayerTurn,
  HandleAnyPlayerOutOfCards,
  HandleCardEffectForPlayer,
  HandleCardEffectForOpponent,
  UpdateCardPile,
  AddCardToPile,
}

export interface InitPlayerAction {
  name: Action.InitPlayer;
  value: { player: Player };
}
export interface AddOpponentAction {
  name: Action.AddOpponent;
  value: { opponent: Opponent };
}
export interface AddOpponentsAction {
  name: Action.AddOpponents;
  value: { opponents: Opponent[] };
}
export interface UpdateOpponentAction {
  name: Action.UpdateOpponent;
  value: { opponent: Opponent };
}

export interface RemoveOpponentAction {
  name: Action.RemoveOpponent;
  value: { id: string };
}

export interface PlayerPlaysCardAction {
  name: Action.PlayerPlaysCard;
  value: { newCards: CardInHand[] };
}

export interface OpponentPlaysCardAction {
  name: Action.OpponentPlaysCard;
  value: { opponentIndex: number; cardIndex: number };
}
export interface OpponentDrawsCardAction {
  name: Action.OpponentDrawsCard;
  value: { opponentIndex: number };
}

export interface PlayerDrawsCardAction {
  name: Action.PlayerDrawsNewCard;
}

export interface SetPlayerTurn {
  name: Action.SetPlayerTurn;
  value: { position: number };
}

export interface HandleAnyPlayerOutOfCards {
  name: Action.HandleAnyPlayerOutOfCards;
}

export interface HandleCardEffectForPlayer {
  name: Action.HandleCardEffectForPlayer;
}
export interface HandleCardEffectForOpponent {
  name: Action.HandleCardEffectForOpponent;
  value: { opponentIndex: number };
}
export interface UpdateCardPileAction {
  name: Action.UpdateCardPile;
  value: { cards: CardInPile[] };
}
export interface AddCardToPileAction {
  name: Action.AddCardToPile;
  value: { card: CardInPile };
}

export type GameStateAction =
  | InitPlayerAction
  | AddOpponentAction
  | AddOpponentsAction
  | UpdateOpponentAction
  | RemoveOpponentAction
  | PlayerPlaysCardAction
  | OpponentPlaysCardAction
  | OpponentDrawsCardAction
  | PlayerDrawsCardAction
  | SetPlayerTurn
  | HandleAnyPlayerOutOfCards
  | HandleCardEffectForPlayer
  | HandleCardEffectForOpponent
  | UpdateCardPileAction
  | AddCardToPileAction;
