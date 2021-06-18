import { Opponent, CardInHand, CardInPile, InitPlayerDataContent } from './commonTypes';

export type ApiEvent = SystemEvent | ServerEvent;

export enum SystemEvent {
  NewConnection = 'connection',
  ConnectionClosed = 'disconnect',
}

export enum ServerEvent {
  // Player
  InitPlayer = 'InitPlayer',
  PlayerPlaysCard = 'PlayerPlaysCard',
  PlayerPickedUpCard = 'PlayerPickedUpCard',
  PlayerWins = 'PlayerWins',

  // Opponent
  AddOpponent = 'AddOpponent',
  RemoveOpponent = 'RemoveOpponent',
  UpdateOpponent = 'UpdateOpponent',
  OpponentWins = 'OpponentWins',

  // Turn
  SetPlayerTurn = 'SetPlayerTurn',

  // CardPile
  AddCardToPile = 'AddCardToPile',
}

export interface InitPlayerData {
  name: ServerEvent.InitPlayer;
  value: InitPlayerDataContent;
}
export interface AddOpponentData {
  name: ServerEvent.AddOpponent;
  value: { opponent: Opponent };
}
export interface UpdateOpponentData {
  name: ServerEvent.UpdateOpponent;
  value: { opponent: Opponent };
}

export interface RemoveOpponentData {
  name: ServerEvent.RemoveOpponent;
  value: { id: string };
}

export interface PlayerPlaysCardData {
  name: ServerEvent.PlayerPlaysCard;
  value: { newCards: CardInHand[] };
}

export interface OpponentWinsData {
  name: ServerEvent.OpponentWins;
  value: { opponent: Opponent };
}

export interface PlayerPicksUpCardData {
  name: ServerEvent.PlayerPickedUpCard;
  value: { card: CardInHand };
}

export interface PlayerWinsData {
  name: ServerEvent.PlayerWins;
  value: {};
}

export interface SetPlayerTurnData {
  name: ServerEvent.SetPlayerTurn;
  value: { position: number };
}

export interface AddCardToPileData {
  name: ServerEvent.AddCardToPile;
  value: { card: CardInPile };
}

export type GameStateAction =
  | InitPlayerData
  | AddOpponentData
  | UpdateOpponentData
  | RemoveOpponentData
  | PlayerPlaysCardData
  | OpponentWinsData
  | PlayerPicksUpCardData
  | PlayerWinsData
  | SetPlayerTurnData
  | AddCardToPileData;
