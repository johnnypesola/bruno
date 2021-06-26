import { CardInHand, CardInHandWithIndex, CardInPile, CardValue, Player } from '../../../frontend/src/types/commonTypes';
import { ApiServer } from '../ApiServer';
import { ServerEvent } from '../../../frontend/src/types/serverEventTypes';
import { cardEffects, CardEffectData, CardEffect, CardWithEffect } from '../cardEffects';
import { BaseService } from './Base';
import { toOpponent, getRandomCard } from '../../utils';
import { pull, pullAt } from 'lodash';

export class CardEffectService extends BaseService {
  effectsStack: CardEffectData[];
  cardsToPickup: number;
  isReversePlay: boolean;

  constructor(api: ApiServer) {
    super(api);
    this.effectsStack = [];
    this.cardsToPickup = 0;
    this.isReversePlay = false;
  }

  doesCardHaveAnEffect = (card: CardInHand | CardInPile): card is CardWithEffect => {
    return Object.keys(cardEffects).some((val) => val == card.value);
  };

  doesCardMatchEffectStack = (card: CardInHand): boolean => {
    const effectValue = this.effectsStack[0].cardValue;
    return card.value === effectValue;
  };

  getFirstEffectFromStack = (): CardEffectData => {
    return this.effectsStack[0];
  };

  getTopCardEffect = async (): Promise<CardEffectData | void> => {
    const topCard = await this.api.services.CardPile.getTopCard();
    return this.doesCardHaveAnEffect(topCard) ? cardEffects[topCard.value] : undefined;
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

  runAllCardEffects = (player: Player, occasion: 'onPlayCard' | 'onNextPlayerTurn' | 'onPickUpCard'): void => {
    if (!this.effectsStack.length) return;
    const effectsToRun = this.effectsStack.filter((effect) => !!effect.callback[occasion]);

    pull(this.effectsStack, ...effectsToRun);

    effectsToRun.forEach(({ callback }) => {
      const socket = this.api.services.Player.getSocketForPlayer(player);
      console.log('Running stacked card effect', occasion);
      const callbackToRun = callback[occasion];
      if (callbackToRun !== undefined) {
        callbackToRun({ player, api: this.api, socket });
      }
    });
  };

  canPlayCard = async (card: CardInHand): Promise<void> => {
    const topCard = await this.api.services.CardPile.getTopCard();

    let canPlay = this.cardsToPickup == 0 && (topCard.value === card.value || card.color === topCard.color);

    const topCardEffect = await this.getTopCardEffect();
    if (!topCard.isEffectConsumed && topCardEffect) {
      const { mustPickUpCard, canPlaySameCard } = topCardEffect.playerRestrictions;
      if (mustPickUpCard) canPlay = false;
      if (canPlaySameCard && topCardEffect.cardValue === card.value) canPlay = true;
    }

    if (canPlay) {
      console.log('player can play card', card);
      return Promise.resolve();
    } else {
      console.log('player cannot play card', card, topCard);
      return Promise.reject();
    }
  };

  canSelectCard = async (player: Player, cardIndex: number, isSelected: boolean): Promise<void> => {
    if (!isSelected) return Promise.resolve();
    const cardToSelect = player.cards[cardIndex];
    const firstSelectedCard = player.cards.find((card) => card.isSelected);

    console.log(firstSelectedCard?.value, cardToSelect.value);
    if (firstSelectedCard?.value == cardToSelect.value) return Promise.resolve();
    if (firstSelectedCard) return Promise.reject();
    return this.canPlayCard(cardToSelect);
  };

  selectCard = async (player: Player, cardIndex: number, isSelected: boolean): Promise<void> => {
    if (isSelected) {
      player.cards[cardIndex].isSelected = isSelected;
      const nextOrderNum = player.cards.filter(({ isSelected }) => isSelected).length;
      player.cards[cardIndex].selectedOrder = nextOrderNum;
    } else {
      player.cards.forEach((card) => (card.isSelected = false));
    }

    const socket = this.api.services.Player.getSocketForPlayer(player);
    this.api.sendToSocket({ name: ServerEvent.PlayerSelectsCard, value: { newCards: player.cards } }, socket);
    const opponent = toOpponent(player);
    this.api.sendToOtherSockets({ name: ServerEvent.UpdateOpponent, value: { opponent } }, socket);
  };

  canPlaySelectedCards = (player: Player): boolean => !!player.cards.find(({ isSelected }) => isSelected);

  playSelectedCards = async (player: Player): Promise<void> => {
    const cardsToPlay = this.getSelectedCardsInOrder(player.cards);
    this.playCards(
      player,
      cardsToPlay.map((card) => card.index),
    );
  };

  playCards = async (player: Player, cardIndexes: number[]): Promise<void> => {
    const playedCards = pullAt(player.cards, cardIndexes);

    playedCards.forEach((playedCard) => {
      this.api.services.CardPile.addCardToPile(playedCard);

      this.stackPlayedCardEffect(playedCard);

      const socket = this.api.services.Player.getSocketForPlayer(player);
      this.api.sendToSocket({ name: ServerEvent.PlayerPlaysCard, value: { newCards: player.cards } }, socket);
      const opponent = toOpponent(player);
      this.api.sendToOtherSockets({ name: ServerEvent.UpdateOpponent, value: { opponent } }, socket);
    });

    this.runAllCardEffects(player, 'onPlayCard');

    this.api.services.Player.setNextPlayersTurn();
  };

  pickupCard = async (player: Player): Promise<void> => {
    const socket = this.api.services.Player.getSocketForPlayer(player);

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

    this.runAllCardEffects(player, 'onPickUpCard');
    const mustPickupCard = this.getFirstEffectFromStack()?.playerRestrictions.mustPickUpCard;

    const topCard = await this.api.services.CardPile.getTopCard();
    const topCardEffect = await this.getTopCardEffect();
    if (topCardEffect) topCard.isEffectConsumed = true;
    if (!mustPickupCard) this.api.services.Player.setNextPlayersTurn();
  };

  private getSelectedCardsInOrder = (cards: CardInHand[]): CardInHandWithIndex[] => {
    return [...cards]
      .map((card, index) => ({ ...card, index }))
      .filter(({ isSelected }) => isSelected)
      .sort((a, b) => {
        if (a.selectedOrder == undefined || b.selectedOrder == undefined) return 0;
        return a.selectedOrder > b.selectedOrder ? 1 : -1;
      });
  };
}
