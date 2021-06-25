import { Socket } from 'socket.io';
import { Player, CardValue, CardInHand } from '../../frontend/src/types/commonTypes';
import { ApiServer } from './ApiServer';

type effectFnData = { player: Player; api: ApiServer; socket: Socket };
type effectFn = (data: effectFnData) => void;

type playerRestrictions = {
  cardValue: CardValue;
  canPlaySameCard: boolean;
  mustPickUpCard: boolean;
};

export type CardEffectData = {
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
};

export const cardEffects: CardEffect = {
  [CardValue.PlusTwo]: {
    playerRestrictions: {
      cardValue: CardValue.PlusTwo,
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
    playerRestrictions: {
      cardValue: CardValue.Skip,
      canPlaySameCard: false,
      mustPickUpCard: false,
    },
    callback: {
      onNextPlayerTurn: ({ api }) => {
        api.services.Player.setNextPlayersTurn();
      },
    },
  },
};

export type CardWithEffect = Omit<CardInHand, "value"> & { value: keyof CardEffect };
