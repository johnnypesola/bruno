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

  // Opponent
  AddOpponent = 'AddOpponent',
  AddOpponents = 'AddOpponents',
  OpponentPlaysCard = 'OpponentPlaysCard',
  OpponentDrawsCard = 'OpponentDrawsCard',
  RemoveOpponent = 'RemoveOpponent',
  UpdateOpponent = 'UpdateOpponent',

  // Turn
  SetPlayerTurn = 'SetPlayerTurn',

  // CardPile
  UpdateCardPile = 'UpdateCardPile',
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
export interface AddOpponentsData {
  name: ServerEvent.AddOpponents;
  value: { opponents: Opponent[] };
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

export interface OpponentPlaysCardData {
  name: ServerEvent.OpponentPlaysCard;
  value: { opponentIndex: number; cardIndex: number };
}
export interface OpponentDrawsCardData {
  name: ServerEvent.OpponentDrawsCard;
  value: { opponentIndex: number };
}

export interface PlayerPicksUpCardData {
  name: ServerEvent.PlayerPickedUpCard;
  value: { card: CardInHand };
}

export interface SetPlayerTurnData {
  name: ServerEvent.SetPlayerTurn;
  value: { position: number };
}

export interface UpdateCardPileData {
  name: ServerEvent.UpdateCardPile;
  value: { cards: CardInPile[] };
}
export interface AddCardToPileData {
  name: ServerEvent.AddCardToPile;
  value: { card: CardInPile };
}

export type GameStateAction =
  | InitPlayerData
  | AddOpponentData
  | AddOpponentsData
  | UpdateOpponentData
  | RemoveOpponentData
  | PlayerPlaysCardData
  | OpponentPlaysCardData
  | OpponentDrawsCardData
  | PlayerPicksUpCardData
  | SetPlayerTurnData
  | UpdateCardPileData
  | AddCardToPileData;
