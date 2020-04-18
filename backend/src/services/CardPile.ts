import { CardInPile, CardInHand } from '../../../src/types/commonTypes';
import { toPileCard, getRandomCard } from '../../utils';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';
import { ServerEvent } from '../../../src/types/serverEventTypes';

export class CardPileService extends BaseService {
  cardsInPile: CardInPile[];

  constructor(api: ApiServer) {
    super(api);
    this.cardsInPile = [toPileCard(getRandomCard())];
    console.log('Initiated cardpile with ', this.cardsInPile);
  }

  async addCardToPile(card: CardInHand): Promise<void> {
    const pileCard = toPileCard(card);
    this.cardsInPile.push(pileCard);
    console.log(`Added card (${card.value} ${card.color}) to pile`);

    this.api.typedEmit({ name: ServerEvent.AddCardToPile, value: { card: pileCard } });
  }

  async getTopCard(): Promise<CardInHand> {
    const card = this.cardsInPile[this.cardsInPile.length - 1];
    return Promise.resolve(this.asCardInHand(card));
  }

  private asCardInHand(card: CardInPile): CardInHand {
    const { color, value } = card;
    return { color, value, isConcealed: false };
  }
}
