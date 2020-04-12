import { Opponent } from './commonTypes';

export enum Action {
  AddOpponent,
  AddOpponents,
  RemoveOpponent,
  PlayerPlaysCard,
  OpponentPlaysCard,
  OpponentDrawsCard,
  PlayerDrawsNewCard,
  SetNextPlayerTurn,
  HandleAnyPlayerOutOfCards,
  HandleCardEffectForPlayer,
  HandleCardEffectForOpponent,
}

export interface AddOpponentAction {
  name: Action.AddOpponent;
  value: { opponent: Opponent };
}
export interface AddOpponentsAction {
  name: Action.AddOpponents;
  value: { opponents: Opponent[] };
}

export interface RemoveOpponentAction {
  name: Action.RemoveOpponent;
  value: { id: string };
}

export interface PlayerPlaysCardAction {
  name: Action.PlayerPlaysCard;
  value: { cardIndex: number };
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

export interface SetNextPlayerTurn {
  name: Action.SetNextPlayerTurn;
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

export type GameStateAction =
  | AddOpponentAction
  | AddOpponentsAction
  | RemoveOpponentAction
  | PlayerPlaysCardAction
  | OpponentPlaysCardAction
  | OpponentDrawsCardAction
  | PlayerDrawsCardAction
  | SetNextPlayerTurn
  | HandleAnyPlayerOutOfCards
  | HandleCardEffectForPlayer
  | HandleCardEffectForOpponent;
