import { CardInHand, Player, Opponent, CardValue } from '../../src/types/commonTypes';
import { CardPileService } from './services/CardPile';
import { ApiServer } from './ApiServer';
import { ServiceName } from '../../src/types/services';
import { ServerEvent } from '../../src/types/serverEventTypes';
import { PlayerService } from './services/Player';
import { getRandomCard } from '../utils';

type effectFnData = { player: Player; api: ApiServer; socket: any };
type effectFn = (data: effectFnData) => void;

type CardEffect = {
  [CardValue.Reverse]: effectFn;
  [CardValue.PlusTwo]: effectFn;
};

const effects: CardEffect = {
  [CardValue.PlusTwo]: ({ api }) => {
    const nextPlayer = api.service<PlayerService>(ServiceName.Player).getNextPlayer();
    nextPlayer.cards = [...nextPlayer.cards, getRandomCard(), getRandomCard()];
  },
  [CardValue.Reverse]: () => null,
};

const doesCardHaveAnEffect = (card: CardInHand): boolean => Object.keys(effects).some(val => val == card.value);

export const triggerCardEffect = (card: CardInHand, player: Player, api: ApiServer, socket: any): void => {
  api.service<CardPileService>(ServiceName.CardPile).addCardToPile(card);

  api.typedEmit({ name: ServerEvent.PlayerPlaysCard, value: { newCards: player.cards } }, socket);

  if (doesCardHaveAnEffect(card)) {
    // Apply effect
    effects[card.value]({ player, api, socket });
  }

  // Emit update to opponents about players cards.
  const opponent: Opponent = {
    ...player,
    cards: player.cards.map(() => null),
  };

  this.api.typedBroadcastEmit({ name: ServerEvent.UpdateOpponent, value: { opponent } }, socket);
};

export const canPlayCard = async (card: CardInHand, api: ApiServer): Promise<void> => {
  const topCard = await api.service<CardPileService>(ServiceName.CardPile).getTopCard();
  const canPlay = topCard.value === card.value || card.color === topCard.color;

  if (canPlay) {
    console.log('player can play card', card);
    return Promise.resolve();
  } else {
    console.log('player cannot play card', card, topCard);
    return Promise.reject();
  }
};
