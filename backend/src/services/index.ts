import { CardPileService } from './CardPile';
import { PlayerService } from './Player';
import { ServiceName } from '../../../src/types/services';
import { ApiServer } from '../ApiServer';

export type ServiceType = CardPileService | PlayerService;

export default (api: ApiServer): void => {
  // Register our services
  api.addService(ServiceName.CardPile, new CardPileService(api));
  api.addService(ServiceName.Player, new PlayerService(api));

  // api.service(Service.CardPile).emit;
};
