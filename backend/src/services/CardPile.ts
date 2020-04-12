import { CardInPile, CardInHand } from '../../../src/types/commonTypes';
import { toPileCard, getRandomCard } from '../../utils';
import { EventEmitter } from 'events';
import { CardPileEvent } from '../../../src/types/events';

export class CardPileService extends EventEmitter {
  cardsInPile: CardInPile[];
  events: CardPileEvent[];

  constructor() {
    super();
    this.events = Object.values(CardPileEvent);
    this.cardsInPile = [toPileCard(getRandomCard())];
  }

  async find(): Promise<CardInPile[]> {
    return this.cardsInPile;
  }

  async addCardToPile(card: CardInHand): Promise<void> {
    this.cardsInPile.push(toPileCard(card));
    console.log(`Added card (${card.value} ${card.color}) to pile`);
    this.emit(CardPileEvent.CardAddedToPile, card);
  }

  // async create (card: CardInHand) {
  //   this.cards.push(toPileCard(card));
  //   console.log(`Added card (${card.value} ${card.color}) to pile`);
  // }
}
