import { ServiceAddons } from '@feathersjs/feathers';
import { Api } from '../../Api';
import { CardPileService } from './CardPile';
import { PlayerService } from './Player';

export enum Service {
  CardPile = 'cardpile',
  Player = 'player',
}

export interface Services {
  cardPile: CardPileService & ServiceAddons<any>;
  player: PlayerService & ServiceAddons<any>;
}

export default (app: Api): void => {
  // Register our services
  app.use(Service.CardPile, new CardPileService());
  app.use(Service.Player, new PlayerService());
};
