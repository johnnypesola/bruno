export type ApiEvent = SystemEvent | PlayerEvent | OpponentEvent | CardPileEvent;

export enum SystemEvent {
  NewConnection = 'connection',
  ConnectionClosed = 'disconnect',
}

export enum PlayerEvent {
  PlayerAdded = 'PlayerAdded',
  PlayerInit = 'PlayerInit',
  PlayerRemoved = 'PlayerRemoved',
  PlaysCard = 'PlaysCard',
  PlayedCard = 'PlayedCard',
  PicksUpCard = 'PicksUpCard',
  PickedUpCard = 'PickedUpCard',
  NextPlayerTurn = 'NextPlayerTurn',
}

export enum OpponentEvent {
  OpponentAdded = 'OpponentAdded',
  OpponentRemoved = 'OpponentRemoved',
  OpponentUpdate = 'OpponentUpdate',
}

export enum CardPileEvent {
  CardAddedToPile = 'CardAddedToPile',
}
