import { CardInHand, Player, Opponent, CardValue } from '../../../src/types/commonTypes';
import { CardPileService } from '../services/CardPile';
import { ApiServer } from '../ApiServer';
import { Service } from '../../../src/types/services';
import { ServerEvent } from '../../../src/types/serverEventTypes';
import { cardEffects, CardEffect, CardEffectData } from '../cardEffects';
import { BaseService } from './Base';
import { PlayerService } from './Player';
import { toOpponent, getRandomCard } from '../../utils';

export class CardEffectService extends BaseService {
  effectsStack: CardEffectData[];

  constructor(api: ApiServer) {
    super(api);
    this.effectsStack = [];
  }

  doesCardHaveAnEffect = (card: CardInHand): boolean => {
    return Object.keys(cardEffects).some(val => val == card.value);
  };

  doesCardMatchEffectStack = (card: CardInHand): boolean => {
    const [effectValue] = Object.keys(this.effectsStack[0])[0];
    return card.value === effectValue;
  };

  getFirstEffectFromStack = (): CardEffectData => {
    return this.effectsStack[0];
  };

  areAnyEffectsInStack = (): boolean => {
    return this.effectsStack.length > 0;
  };

  stackPlayedCardEffect = (card: CardInHand): void => {
    if (!this.doesCardHaveAnEffect(card) || (this.areAnyEffectsInStack() && !this.doesCardMatchEffectStack(card)))
      return;

    console.log('Added played card effect to stack');
    this.effectsStack.push(cardEffects[card.value]);
  };

  addEffectToStack = (effectData: CardEffectData): void => {
    console.log('Added card effect to stack');
    this.effectsStack.push(effectData);
  };

  runFirstEffect = (player: Player): void => {
    const { effect } = this.effectsStack[0];
    const socket = this.api.service<PlayerService>(Service.Player).getSocketForPlayer(player);

    console.log('Running stacked card effect');
    this.resolveFirstEffect();
    effect({ player, api: this.api, socket });
  };

  resolveFirstEffect = (): void => {
    if (this.areAnyEffectsInStack()) {
      console.log('Resolving stacked card effect');
      this.effectsStack.pop();
    }
  };

  canPlayCard = async (card: CardInHand): Promise<void> => {
    const topCard = await this.api.service<CardPileService>(Service.CardPile).getTopCard();

    let canPlay = topCard.value === card.value || card.color === topCard.color;

    if (this.areAnyEffectsInStack()) {
      const { playerRestrictions } = this.getFirstEffectFromStack();
      const { mustPickUpCard, canPlaySameCard, cardValue } = playerRestrictions;
      if (mustPickUpCard) canPlay = false;
      if (canPlaySameCard && cardValue === card.value) canPlay = true;
    }

    if (canPlay) {
      console.log('player can play card', card);
      return Promise.resolve();
    } else {
      console.log('player cannot play card', card, topCard);
      return Promise.reject();
    }
  };
  playCard = async (player: Player, cardIndex: number): Promise<void> => {
    const playedCard = player.cards.splice(cardIndex, 1)[0];
    this.api.service<CardPileService>(Service.CardPile).addCardToPile(playedCard);

    this.stackPlayedCardEffect(playedCard);

    const socket = this.api.service<PlayerService>(Service.Player).getSocketForPlayer(player);
    this.api.sendToSocket({ name: ServerEvent.PlayerPlaysCard, value: { newCards: player.cards } }, socket);

    this.api.service<PlayerService>(Service.Player).setNextPlayersTurn();
  };

  pickupCard = (player: Player): void => {
    const card = getRandomCard(false);
    player.cards.push(card);

    this.resolveFirstEffect();

    const socket = this.api.service<PlayerService>(Service.Player).getSocketForPlayer(player);
    this.api.sendToSocket({ name: ServerEvent.PlayerPickedUpCard, value: { card } }, socket);

    const opponent = toOpponent(player);
    this.api.sendToOtherSockets({ name: ServerEvent.UpdateOpponent, value: { opponent } }, socket);

    if (this.getFirstEffectFromStack()?.playerRestrictions.mustPickUpCard) {
      return;
    }

    this.api.service<PlayerService>(Service.Player).setNextPlayersTurn();
  };
}
