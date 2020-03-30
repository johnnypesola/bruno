export enum Action {
  PlayerPlaysCard,
  OpponentPlaysCard,
  OpponentDrawsCard,
  PlayerDrawsNewCard,
  SetNextPlayerTurn,
  HandleAnyPlayerOutOfCards,
  HandleCardEffectForPlayer,
  HandleCardEffectForOpponent,
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
  | PlayerPlaysCardAction
  | OpponentPlaysCardAction
  | OpponentDrawsCardAction
  | PlayerDrawsCardAction
  | SetNextPlayerTurn
  | HandleAnyPlayerOutOfCards
  | HandleCardEffectForPlayer
  | HandleCardEffectForOpponent;
