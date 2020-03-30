import { useReducer, Dispatch } from 'react';
import { getInitialHand, getRandomCard } from '../utils';
import set from 'lodash/fp/set';
import { flow } from 'lodash/fp';
import {
  GameStateAction,
  PlayerPlaysCardAction,
  Action,
  OpponentPlaysCardAction,
  OpponentDrawsCardAction,
} from '../types/gameStateActionTypes';
import { GameState, TablePosition } from '../types/commonTypes';

const useGameState = (): [GameState, Dispatch<GameStateAction>] => {
  const reducer = (state: GameState, action: GameStateAction): GameState => {
    if (action.name === Action.PlayerPlaysCard) {
      const { cardIndex } = (action as PlayerPlaysCardAction).value;
      const newTopCard = state.player.cards[cardIndex];
      const newCards = state.player.cards.filter((card, index) => index !== cardIndex);

      return flow(
        // Update state in sequence
        set(['player', 'cards'], newCards),
        set(['topCard'], newTopCard),
      )(state);
    }

    if (action.name === Action.OpponentPlaysCard) {
      const { cardIndex, opponentIndex } = (action as OpponentPlaysCardAction).value;
      const opponent = state.opponents[opponentIndex];
      const newTopCard = opponent.cards[cardIndex];
      const newCards = opponent.cards.filter((card, index) => index !== cardIndex);

      return flow(
        // Update state in sequence
        set(['opponents', opponentIndex, 'cards'], newCards),
        set(['topCard'], newTopCard),
      )(state);
    }

    if (action.name === Action.OpponentDrawsCard) {
      const { opponentIndex } = (action as OpponentDrawsCardAction).value;
      const newCard = getRandomCard();
      return set(['opponents', opponentIndex, 'cards'], [...state.opponents[opponentIndex].cards, newCard])(state);
    }

    if (action.name === Action.SetNextPlayerTurn) {
      const nextPlayerIndex = state.playerTurn >= state.opponents.length - 1 ? -1 : state.playerTurn + 1;
      return set(['playerTurn'], nextPlayerIndex)(state);
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
    player: { cards: getInitialHand(false), hasExitedGame: false },
    opponents: [
      { name: 'Benny', cards: getInitialHand(), position: TablePosition.OpponentLeft, hasExitedGame: false },
      { name: 'Fanny', cards: getInitialHand(), position: TablePosition.OpponentRight, hasExitedGame: false },
    ],
    topCard: getRandomCard(),
    playerTurn: -1,
  };

  return useReducer(reducer, initialGameState);
};

export default useGameState;
