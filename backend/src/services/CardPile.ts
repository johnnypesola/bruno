import { CardInPile, CardInHand } from '../../../src/types/commonTypes';
import { toPileCard, getRandomCard } from '../../utils';
import { CardPileEvent } from '../../../src/types/events';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';

export class CardPileService extends BaseService {
  cardsInPile: CardInPile[];

  constructor(api: ApiServer) {
    super(api);
    this.cardsInPile = [toPileCard(getRandomCard())];
  }

  async find(): Promise<CardInPile[]> {
    return this.cardsInPile;
  }

  async addCardToPile(card: CardInHand): Promise<void> {
    this.cardsInPile.push(toPileCard(card));
    console.log(`Added card (${card.value} ${card.color}) to pile`);
    this.api.emit(CardPileEvent.CardAddedToPile, card);
  }
}
