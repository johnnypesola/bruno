import { useReducer, Dispatch } from 'react';
import set from 'lodash/fp/set';
import { flow } from 'lodash/fp';
import {
  GameStateAction,
  PlayerPlaysCardAction,
  Action,
  OpponentPlaysCardAction,
  OpponentDrawsCardAction,
  HandleCardEffectForOpponent,
  AddOpponentAction,
  RemoveOpponentAction,
  AddOpponentsAction,
  UpdateOpponentAction,
  InitPlayerAction,
  UpdateCardPileAction,
  AddCardToPileAction,
} from '../types/gameStateActionTypes';
import { getTopCard, getInitialHand, getRandomCard, toPileCard } from '../utils';
import { GameState, CardValue } from '../types/commonTypes';

const useGameState = (): [GameState, Dispatch<GameStateAction>] => {
  const reducer = (state: GameState, action: GameStateAction): GameState => {
    if (action.name === Action.InitPlayer) {
      const { player } = (action as InitPlayerAction).value;
      console.log('Action.InitPlayer', player);

      return set(['player'], player)(state);
    }

    if (action.name === Action.AddOpponent) {
      console.log('Action.AddOpponent');

      const { opponent } = (action as AddOpponentAction).value;
      console.log(opponent);
      return set(['opponents'], [...state.opponents, opponent])(state);
    }
    if (action.name === Action.AddOpponents) {
      console.log('Action.AddOpponents');
      const { opponents } = (action as AddOpponentsAction).value;
      console.log(opponents);
      return set(['opponents'], opponents)(state);
    }
    if (action.name === Action.UpdateOpponent) {
      console.log('Action.UpdateOpponent');
      const { opponent } = (action as UpdateOpponentAction).value;
      console.log('opponent!', opponent);
      const opponentIndex = state.opponents.findIndex(({ id }) => id === opponent.id);
      const updatedOpponents = [...state.opponents].splice(opponentIndex, 1, opponent);

      console.log('updated opponents', updatedOpponents);

      return set(['opponents'], updatedOpponents)(state);
    }

    if (action.name === Action.RemoveOpponent) {
      const { id } = (action as RemoveOpponentAction).value;
      const newOpponents = state.opponents.filter(opponent => opponent.id === id);

      console.log('newOpponents', newOpponents);

      console.log('Action.RemoveOpponent');
      return set(['opponents'], [...newOpponents])(state);
    }

    if (action.name === Action.PlayerPlaysCard) {
      const { newCards } = (action as PlayerPlaysCardAction).value;

      console.log('PlayerPlaysCard', newCards);

      const newState = flow(
        // Update state in sequence
        set(['player', 'cards'], newCards),
      )(state);

      return newState;
    }

    if (action.name === Action.OpponentPlaysCard) {
      const { cardIndex, opponentIndex } = (action as OpponentPlaysCardAction).value;
      const opponent = state.opponents[opponentIndex];
      // const newTopCard = toPileCard(opponent.cards[cardIndex]);
      // const newTopCard = toPileCard(getRandomCard());
      const newCards = opponent.cards.filter((card, index) => index !== cardIndex);

      const newState = flow(
        // Update state in sequence
        set(['opponents', opponentIndex, 'cards'], newCards),
      )(state);

      // if (newTopCard.value === CardValue.Reverse) {
      //   newState = set(['isReversePlayDirection'], !state.isReversePlayDirection)(newState);
      // }
      return newState;
    }

    if (action.name === Action.UpdateCardPile) {
      const { cards } = (action as UpdateCardPileAction).value;

      return set(['cardPile'], [...cards])(state);
    }
    if (action.name === Action.AddCardToPile) {
      const { card } = (action as AddCardToPileAction).value;

      return set(['cardPile'], [...state.cardPile, card])(state);
    }

    if (action.name === Action.OpponentDrawsCard) {
      const { opponentIndex } = (action as OpponentDrawsCardAction).value;
      const newCard = getRandomCard();
      return set(['opponents', opponentIndex, 'cards'], [...state.opponents[opponentIndex].cards, newCard])(state);
    }

    if (action.name === Action.HandleCardEffectForOpponent) {
      const { opponentIndex } = (action as HandleCardEffectForOpponent).value;

      if (getTopCard(state.cardPile).value == CardValue.PlusTwo) {
        const newCards = [getRandomCard(), getRandomCard()];
        return set(
          ['opponents', opponentIndex, 'cards'],
          [...state.opponents[opponentIndex].cards, ...newCards],
        )(state);
      }
    }

    if (action.name === Action.HandleCardEffectForPlayer) {
      const topCard = getTopCard(state.cardPile);
      if (topCard && topCard.value == CardValue.PlusTwo) {
        const newCards = [getRandomCard(false), getRandomCard(false)];
        return set(['player', 'cards'], [...state.player.cards, ...newCards])(state);
      }
    }

    if (action.name === Action.SetPlayerTurn) {
      const { position } = action.value;
      // let nextPlayerIndex;
      // if (state.isReversePlayDirection) {
      //   nextPlayerIndex = state.playerTurn !== -1 ? state.playerTurn - 1 : state.opponents.length - 1;
      // } else {
      //   nextPlayerIndex = state.playerTurn >= state.opponents.length - 1 ? -1 : state.playerTurn + 1;
      // }
      return set(['playerTurn'], position)(state);
    }

    if (action.name === Action.PlayerDrawsNewCard) {
      const newCard = getRandomCard(false);
      return set(['player', 'cards'], [...state.player.cards, newCard])(state);
    }

    if (action.name === Action.HandleAnyPlayerOutOfCards) {
      const opponentOutOfCardsIndex = state.opponents.findIndex(
        opponent => !opponent.hasExitedGame && opponent.cards.length === 0,
      );
      if (opponentOutOfCardsIndex !== -1) {
        return set(['opponents', opponentOutOfCardsIndex, 'hasExitedGame'], true)(state);
      }
      if (state.player.cards.length === 0) {
        console.log('player exited');
        return set(['player', 'hasExitedGame'], true)(state);
      }
    }

    // Default fallback
    return state;
  };

  const initialGameState: GameState = {
    player: { id: 'Player', cards: [], hasExitedGame: false, position: 0 },
    opponents: [
      // { id: 'Benny', cards: [], position: TablePosition.OpponentLeft, hasExitedGame: false },
      // { id: 'Fanny', cards: [], position: TablePosition.OpponentRight, hasExitedGame: false },
    ],
    cardPile: [],
    playerTurn: -1,
    isReversePlayDirection: false,
  };

  return useReducer(reducer, initialGameState);
};

export default useGameState;
