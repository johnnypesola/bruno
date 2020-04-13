export type ApiEvent = SystemEvent | PlayerEvent | CardPileEvent;

export enum SystemEvent {
  NewConnection = 'connection',
  ConnectionClosed = 'disconnect',
}

export enum PlayerEvent {
  PlayerAdded = 'PlayerAdded',
  PlayerInit = 'PlayerInit',
  PlayerRemoved = 'PlayerRemoved',
  PlayCard = 'PlayCard',
}

export enum CardPileEvent {
  CardAddedToPile = 'CardAddedToPile',
}
