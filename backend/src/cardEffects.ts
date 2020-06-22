import { Player, CardValue } from '../../src/types/commonTypes';
import { ApiServer } from './ApiServer';
import { PlayerService } from './services/Player';
import { Service } from '../../src/types/services';
import { getRandomCard, toOpponent } from '../utils';
import { ServerEvent } from '../../src/types/serverEventTypes';
import { CardEffectService } from './services/CardEffect';

type effectFnData = { player: Player; api: ApiServer; socket: any };
type effectFn = (data: effectFnData) => void;

type playerRestrictions = {
  cardValue: CardValue;
  canPlaySameCard: boolean;
  mustPickUpCard: boolean;
};

export type CardEffectData = {
  playerRestrictions: playerRestrictions;
  effect?: effectFn;
};

export type CardEffect = {
  [CardValue.PlusTwo]: CardEffectData;
  [CardValue.Skip]: CardEffectData;
};

export const cardEffects: CardEffect = {
  [CardValue.PlusTwo]: {
    playerRestrictions: {
      cardValue: CardValue.PlusTwo,
      canPlaySameCard: true,
      mustPickUpCard: true,
    },
    effect: ({ api }) => {
      api.service<CardEffectService>(Service.CardEffect).addEffectToStack({
        playerRestrictions: {
          cardValue: CardValue.PlusTwo,
          canPlaySameCard: true,
          mustPickUpCard: true,
        },
      });
      api.service<CardEffectService>(Service.CardEffect).addEffectToStack({
        playerRestrictions: {
          cardValue: CardValue.PlusTwo,
          canPlaySameCard: false,
          mustPickUpCard: true,
        },
      });
    },
  },
  [CardValue.Skip]: {
    playerRestrictions: {
      cardValue: CardValue.Skip,
      canPlaySameCard: false,
      mustPickUpCard: false,
    },
    effect: ({ api }) => {
      api.service<PlayerService>(Service.Player).setNextPlayersTurn();
    },
  },
};
