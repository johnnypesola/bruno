import { Player, CardValue } from '../../src/types/commonTypes';
import { ApiServer } from './ApiServer';
import { PlayerService } from './services/Player';
import { Service } from '../../src/types/services';
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
  resolveOn: 'onPlayCard' | 'onNextPlayerTurn' | 'onPickUpCard' | 'any';
  isConsumed?: true;
  effect?: {
    onPlayCard?: effectFn;
    onNextPlayerTurn?: effectFn;
    onPickUpCard?: effectFn;
  };
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
    resolveOn: 'onNextPlayerTurn',
    effect: {
      onNextPlayerTurn: ({ api }) => {
        api.service<CardEffectService>(Service.CardEffect).cardsToPickup += 2;
      },
    },
  },
  [CardValue.Skip]: {
    playerRestrictions: {
      cardValue: CardValue.Skip,
      canPlaySameCard: false,
      mustPickUpCard: false,
    },
    resolveOn: 'onNextPlayerTurn',
    effect: {
      onPlayCard: ({ api }) => {
        api.service<PlayerService>(Service.Player).setNextPlayersTurn();
      },
    },
  },
};
