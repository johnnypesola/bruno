import { CardInHand, Player } from '../../../src/types/commonTypes';
import { CardPileService } from '../services/CardPile';
import { ApiServer } from '../ApiServer';
import { Service } from '../../../src/types/services';
import { ServerEvent } from '../../../src/types/serverEventTypes';
import { cardEffects, CardEffectData } from '../cardEffects';
import { BaseService } from './Base';
import { PlayerService } from './Player';
import { toOpponent, getRandomCard } from '../../utils';

export class CardEffectService extends BaseService {
  effectsStack: CardEffectData[];
  cardsToPickup: number;

  constructor(api: ApiServer) {
    super(api);
    this.effectsStack = [];
    this.cardsToPickup = 0;
  }

  doesCardHaveAnEffect = (card: CardInHand): boolean => {
    return Object.keys(cardEffects).some(val => val == card.value);
  };

  doesCardMatchEffectStack = (card: CardInHand): boolean => {
    const effectValue = this.effectsStack[0].playerRestrictions.cardValue;
    return card.value === effectValue;
  };

  getFirstEffectFromStack = (): CardEffectData => {
    return this.effectsStack[0];
  };

  getTopCardEffect = async (): Promise<CardEffectData | void> => {
    const topCard = await this.api.service<CardPileService>(Service.CardPile).getTopCard();
    return cardEffects[topCard.value];
  };

  areAnyEffectsInStack = (): boolean => {
    return this.effectsStack.length > 0;
  };

  stackPlayedCardEffect = (card: CardInHand): void => {
    if (!this.doesCardHaveAnEffect(card) || (this.areAnyEffectsInStack() && !this.doesCardMatchEffectStack(card))) {
      console.log('Wont stack card effect');
      return;
    }

    console.log('Added played card effect to stack');
    this.effectsStack.push(cardEffects[card.value]);
  };

  addEffectsToStack = (effectsData: CardEffectData[]): void => {
    console.log('Added card effects to stack');
    effectsData.forEach(effect => this.effectsStack.push(effect));
  };

  runFirstEffect = (player: Player, occasion: 'onPlayCard' | 'onNextPlayerTurn' | 'onPickUpCard'): void => {
    if (!this.effectsStack.length) return;
    const { effect, resolveOn } = this.effectsStack[0];

    if (resolveOn == occasion) this.resolveFirstEffect();

    if (effect && effect[occasion]) {
      const socket = this.api.service<PlayerService>(Service.Player).getSocketForPlayer(player);
      console.log('Running stacked card effect', occasion);
      effect[occasion]({ player, api: this.api, socket });
    }
  };

  resolveFirstEffect = (): void => {
    if (this.areAnyEffectsInStack()) {
      console.log('Resolving stacked card effect');
      this.effectsStack.shift();
    } else {
      console.log('No effects found in stack');
    }
  };

  canPlayCard = async (card: CardInHand): Promise<void> => {
    const topCard = await this.api.service<CardPileService>(Service.CardPile).getTopCard();

    let canPlay = this.cardsToPickup == 0 && (topCard.value === card.value || card.color === topCard.color);

    const topCardEffect = await this.getTopCardEffect();
    if (!topCard.isEffectConsumed && topCardEffect) {
      const { mustPickUpCard, canPlaySameCard, cardValue } = topCardEffect.playerRestrictions;
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

    this.runFirstEffect(player, 'onPlayCard');

    const socket = this.api.service<PlayerService>(Service.Player).getSocketForPlayer(player);
    this.api.sendToSocket({ name: ServerEvent.PlayerPlaysCard, value: { newCards: player.cards } }, socket);
    const opponent = toOpponent(player);
    this.api.sendToOtherSockets({ name: ServerEvent.UpdateOpponent, value: { opponent } }, socket);

    this.api.service<PlayerService>(Service.Player).setNextPlayersTurn();
  };

  pickupCard = async (player: Player): Promise<void> => {
    const socket = this.api.service<PlayerService>(Service.Player).getSocketForPlayer(player);

    const addCardToPlayer = (): void => {
      const card = getRandomCard(false);
      player.cards.push(card);
      this.api.sendToSocket({ name: ServerEvent.PlayerPickedUpCard, value: { card } }, socket);
    };

    if (this.cardsToPickup) {
      for (let i = 0; i < this.cardsToPickup; i++) addCardToPlayer();
      this.cardsToPickup = 0;
    } else {
      addCardToPlayer();
    }

    const opponent = toOpponent(player);
    this.api.sendToOtherSockets({ name: ServerEvent.UpdateOpponent, value: { opponent } }, socket);

    this.runFirstEffect(player, 'onPickUpCard');
    const mustPickupCard = this.getFirstEffectFromStack()?.playerRestrictions.mustPickUpCard;

    const topCard = await this.api.service<CardPileService>(Service.CardPile).getTopCard();
    const topCardEffect = await this.getTopCardEffect();
    if (topCardEffect) topCard.isEffectConsumed = true;
    if (!mustPickupCard) this.api.service<PlayerService>(Service.Player).setNextPlayersTurn();
  };
}
