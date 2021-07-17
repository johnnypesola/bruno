import { CardInPile, CardInHand } from '../../../frontend/src/types/commonTypes';
import { toPileCard, getRandomCard, getRandomNumericCard } from '../../utils';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';
import { ServerEvent } from '../../../frontend/src/types/serverEventTypes';
import { maxNumberOfPileCards } from '../../../frontend/src/constants';

export class CardPileService extends BaseService {
  cardsInPile: CardInPile[];

  constructor(api: ApiServer) {
    super(api);
    this.cardsInPile = [];
  }

  clearCardPile = (): void => {
    this.cardsInPile = [];
  }

  initCardPile = (): void => {
    this.cardsInPile = [toPileCard(getRandomNumericCard())];
    console.log('Cardpile initiated', this.cardsInPile);
  };

  addCardToPile(card: CardInHand): void {
    const pileCard = toPileCard(card);
    this.cardsInPile.push(pileCard);
    if (this.cardsInPile.length > maxNumberOfPileCards) {
      this.cardsInPile.shift();
    }
    console.log(`Added card (${card.value} ${card.color}) to pile`);

    this.api.sendToAllSockets({ name: ServerEvent.AddCardToPile, value: { card: pileCard } });
  }

  getTopCard(): CardInPile {
    const card = this.cardsInPile[this.cardsInPile.length - 1];
    return card;
  }
}
