import { ServiceAddons } from '@feathersjs/feathers';
import { Api } from '../../Api';
import { CardPileService } from './CardPile';
import { PlayerService } from './Player';
import { Service } from '../../../src/types/services';

export interface AppServices {
  [Service.CardPile]: CardPileService & ServiceAddons<any>;
  [Service.Player]: PlayerService & ServiceAddons<any>;
}

export default (app: Api): void => {
  // Register our services
  app.use(Service.CardPile, new CardPileService());
  app.use(Service.Player, new PlayerService());

  app.service(Service.CardPile).emit;
};
