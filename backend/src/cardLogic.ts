import { CardInHand, Player, Opponent, CardValue } from '../../src/types/commonTypes';
import { CardPileService } from './services/CardPile';
import { ApiServer } from './ApiServer';
import { ServiceName } from '../../src/types/services';
import { ServerEvent } from '../../src/types/serverEventTypes';
import { cardEffects } from './cardEffects';

const doesCardHaveAnEffect = (card: CardInHand): boolean => Object.keys(cardEffects).some(val => val == card.value);

export const triggerCardEffect = (card: CardInHand, player: Player, api: ApiServer, socket: any): void => {
  api.service<CardPileService>(ServiceName.CardPile).addCardToPile(card);

  api.sendToSocket({ name: ServerEvent.PlayerPlaysCard, value: { newCards: player.cards } }, socket);

  if (doesCardHaveAnEffect(card)) {
    // Apply effect
    cardEffects[card.value]({ player, api, socket });
  }
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
