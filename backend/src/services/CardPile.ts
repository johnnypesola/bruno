import { CardInPile, CardInHand } from '../../../src/types/commonTypes';
import { toPileCard, getRandomCard } from '../../utils';

export class CardPileService {
  cardsInPile: CardInPile[] = [toPileCard(getRandomCard())];

  async find(): Promise<CardInPile[]> {
    return this.cardsInPile;
  }

  async addCardToPile(card: CardInHand): Promise<void> {
    this.cardsInPile.push(toPileCard(card));
    console.log(`Added card (${card.value} ${card.color}) to pile`);
  }

  // async create (card: CardInHand) {
  //   this.cards.push(toPileCard(card));
  //   console.log(`Added card (${card.value} ${card.color}) to pile`);
  // }
}
