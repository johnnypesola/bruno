import { useReducer, Dispatch } from 'react';
import set from 'lodash/fp/set';
import { flow } from 'lodash/fp';
import {
  GameStateAction,
  PlayerPlaysCardAction,
  Action,
  OpponentDrawsCardAction,
  HandleCardEffectForOpponent,
  AddOpponentAction,
  RemoveOpponentAction,
  AddOpponentsAction,
  UpdateOpponentAction,
  InitPlayerAction,
  UpdateCardPileAction,
  AddCardToPileAction,
  PlayerPicksUpCardAction as PlayerPickedUpCardAction,
} from '../types/gameStateActionTypes';
import { getTopCard, getRandomCard } from '../utils';
import { GameState, CardValue } from '../types/commonTypes';

const useGameState = (): [GameState, Dispatch<GameStateAction>] => {
  const reducer = (state: GameState, action: GameStateAction): GameState => {
    if (action.name === Action.InitPlayer) {
      const { player } = (action as InitPlayerAction).value;

      return set(['player'], player)(state);
    }

    if (action.name === Action.AddOpponent) {
      const { opponent } = (action as AddOpponentAction).value;
      return set(['opponents'], [...state.opponents, opponent])(state);
    }
    if (action.name === Action.AddOpponents) {
      const { opponents } = (action as AddOpponentsAction).value;
      return set(['opponents'], opponents)(state);
    }
    if (action.name === Action.UpdateOpponent) {
      const { opponent } = (action as UpdateOpponentAction).value;

      const updatedOpponents = state.opponents.map(orgOpponent => {
        if (orgOpponent.id === opponent.id) {
          return opponent;
        } else {
          return orgOpponent;
        }
      });

      return set(['opponents'], updatedOpponents)(state);
    }

    if (action.name === Action.RemoveOpponent) {
      const { id } = (action as RemoveOpponentAction).value;
      const newOpponents = state.opponents.filter(opponent => opponent.id === id);

      return set(['opponents'], [...newOpponents])(state);
    }

    if (action.name === Action.PlayerPlaysCard) {
      const { newCards } = (action as PlayerPlaysCardAction).value;

      const newState = flow(
        // Update state in sequence
        set(['player', 'cards'], newCards),
      )(state);

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

      return set(['playerTurn'], position)(state);
    }

    if (action.name === Action.PlayerPickedUpCard) {
      const { card } = (action as PlayerPickedUpCardAction).value;

      return set(['player', 'cards'], [...state.player.cards, card])(state);
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
    opponents: [],
    cardPile: [],
    playerTurn: -1,
    isReversePlayDirection: false,
  };

  return useReducer(reducer, initialGameState);
};

export default useGameState;
