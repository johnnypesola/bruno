import { CardPileService } from '../../backend/src/services/CardPile';
import { CardEffectService } from '../../backend/src/services/CardEffect';
import { PlayerService } from '../../backend/src/services/Player';
import { GameService } from '../../backend/src/services/Game';

export type ServicesReadonlyMap = {
  readonly ['CardEffect']: CardEffectService;
  readonly ['CardPile']: CardPileService;
  readonly ['Game']: GameService;
  readonly ['Player']: PlayerService;
};
