import { Socket } from 'socket.io';
import { Player, CardValue, CardInHand } from '../../frontend/src/types/commonTypes';
import { ApiServer } from './ApiServer';

type effectFnData = { player: Player; api: ApiServer; socket: Socket };
type effectFn = (data: effectFnData) => void;

type playerRestrictions = {
  canPlaySameCard: boolean;
  mustPickUpCard: boolean;
};

export type CardEffectData = {
  cardValue: CardValue;
  playerRestrictions: playerRestrictions;
  callback: {
    onPlayCard?: effectFn;
    onNextPlayerTurn?: effectFn;
    onPickUpCard?: effectFn;
  };
};

export type CardEffect = {
  [CardValue.PlusTwo]: CardEffectData;
  [CardValue.Skip]: CardEffectData;
  [CardValue.Reverse]: CardEffectData;
};

export const cardEffects: CardEffect = {
  [CardValue.PlusTwo]: {
    cardValue: CardValue.PlusTwo,
    playerRestrictions: {
      canPlaySameCard: true,
      mustPickUpCard: true,
    },
    callback: {
      onNextPlayerTurn: ({ api }) => {
        api.services.CardEffect.cardsToPickup += 2;
      },
    },
  },
  [CardValue.Skip]: {
    cardValue: CardValue.Skip,
    playerRestrictions: {
      canPlaySameCard: false,
      mustPickUpCard: false,
    },
    callback: {
      onNextPlayerTurn: ({ api }) => {
        api.services.Player.setNextPlayersTurn();
      },
    },
  },
  [CardValue.Reverse]: {
    cardValue: CardValue.Reverse,
    playerRestrictions: {
      canPlaySameCard: false,
      mustPickUpCard: false
    },
    callback: {
      onPlayCard: ({ api }) => {
        const { isReversePlay } = api.services.CardEffect;
        api.services.CardEffect.isReversePlay = !isReversePlay;
      }
    }
  }
};

export type CardWithEffect = Omit<CardInHand, "value"> & { value: keyof CardEffect };
