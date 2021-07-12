import { Opponent, CardInHand, CardInPile, InitPlayerDataContent, GameStage } from './commonTypes';

export type ApiEvent = SystemEvent | ServerEvent;

export enum SystemEvent {
  NewConnection = 'connection',
  ConnectionClosed = 'disconnect',
}

export enum ServerEvent {
  // Player
  InitPlayer = 'InitPlayer',
  PlayerPlaysCard = 'PlayerPlaysCard',
  PlayerSelectsCard = 'PlayerSelectsCard',
  PlayerPickedUpCard = 'PlayerPickedUpCard',
  PlayerWins = 'PlayerWins',
  PlayerSelectsCharacter = 'PlayerSelectsCharacter',

  // Opponent
  AddOpponent = 'AddOpponent',
  RemoveOpponent = 'RemoveOpponent',
  UpdateOpponent = 'UpdateOpponent',
  OpponentWins = 'OpponentWins',

  // Turn
  SetPlayerTurn = 'SetPlayerTurn',

  // CardPile
  AddCardToPile = 'AddCardToPile',

  // Game
  GameEndsInSeconds = 'GameEndsInSeconds',
  GameStartsInSeconds = 'GameStartsInSeconds',
  GameStageChange = 'GameStageChange',
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

export interface PlayerSelectsCardData {
  name: ServerEvent.PlayerSelectsCard;
  value: { newCards: CardInHand[] };
}

export interface PlayerPlaysCardData {
  name: ServerEvent.PlayerPlaysCard;
  value: { newCards: CardInHand[] };
}

export interface PlayerSelectsCharacterData {
  name: ServerEvent.PlayerSelectsCharacter;
  value: { characterId: number };
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
  value: Record<string, never>;
}

export interface SetPlayerTurnData {
  name: ServerEvent.SetPlayerTurn;
  value: { position: number };
}

export interface AddCardToPileData {
  name: ServerEvent.AddCardToPile;
  value: { card: CardInPile };
}

export interface GameEndsInSeconds {
  name: ServerEvent.GameEndsInSeconds;
  value: { seconds: number };
}

export interface GameStartsInSeconds {
  name: ServerEvent.GameStartsInSeconds;
  value: { seconds: number };
}

export interface GameStageChange {
  name: ServerEvent.GameStageChange;
  value: { gameStage: GameStage };
}

export type GameStateAction =
  | InitPlayerData
  | AddOpponentData
  | UpdateOpponentData
  | RemoveOpponentData
  | PlayerPlaysCardData
  | PlayerSelectsCardData
  | PlayerSelectsCharacterData
  | OpponentWinsData
  | PlayerPicksUpCardData
  | PlayerWinsData
  | SetPlayerTurnData
  | GameEndsInSeconds
  | GameStartsInSeconds
  | GameStageChange
  | AddCardToPileData;
