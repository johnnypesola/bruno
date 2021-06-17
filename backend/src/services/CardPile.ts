import { CardInPile, CardInHand } from '../../../src/types/commonTypes';
import { toPileCard, getRandomCard } from '../../utils';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';
import { ServerEvent } from '../../../src/types/serverEventTypes';
import { maxNumberOfPileCards } from '../../../src/constants';

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
    if (this.cardsInPile.length > maxNumberOfPileCards) {
      this.cardsInPile.shift();
    }
    console.log(`Added card (${card.value} ${card.color}) to pile`);

    this.api.sendToAllSockets({ name: ServerEvent.AddCardToPile, value: { card: pileCard } });
  }

  async getTopCard(): Promise<CardInPile> {
    const card = this.cardsInPile[this.cardsInPile.length - 1];
    return Promise.resolve(card);
  }
}
