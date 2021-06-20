import { CardPileService } from './CardPile';
import { PlayerService } from './Player';
import { Service } from '../../../src/types/services';
import { ApiServer } from '../ApiServer';
import { CardEffectService } from './CardEffect';
import { GameService } from './Game';

export type ServiceType = CardPileService | PlayerService | CardEffectService | GameService;

export default (api: ApiServer): void => {
  // Register our services
  api.addService(Service.Game, new GameService(api));
  api.addService(Service.CardPile, new CardPileService(api));
  api.addService(Service.Player, new PlayerService(api));
  api.addService(Service.CardEffect, new CardEffectService(api));
};
