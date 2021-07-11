import { Socket } from 'socket.io';
import { Player, CardValue, CardInHand, SpecialCardValue } from '../../frontend/src/types/commonTypes';
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
  [SpecialCardValue.PlusTwo]: CardEffectData;
  [SpecialCardValue.Skip]: CardEffectData;
  [SpecialCardValue.Reverse]: CardEffectData;
};

export const cardEffects: CardEffect = {
  [SpecialCardValue.PlusTwo]: {
    cardValue: SpecialCardValue.PlusTwo,
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
  [SpecialCardValue.Skip]: {
    cardValue: SpecialCardValue.Skip,
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
  [SpecialCardValue.Reverse]: {
    cardValue: SpecialCardValue.Reverse,
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
