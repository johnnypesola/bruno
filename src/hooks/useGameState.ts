import { useReducer, Dispatch } from 'react';
import set from 'lodash/fp/set';
import { flow } from 'lodash/fp';
import { ServerEvent, GameStateAction } from '../types/serverEventTypes';
import { GameState } from '../types/commonTypes';
import { maxNumberOfPileCards } from '../constants';

const useGameState = (): [GameState, Dispatch<GameStateAction>] => {
  const reducer = (state: GameState, action: GameStateAction): GameState => {
    if (action.name === ServerEvent.InitPlayer) {
      const { newPlayer, cardsInPile, opponents, playerTurnPosition } = action.value;

      const newState = flow(
        // Update state in sequence
        set(['player'], newPlayer),
        set(['opponents'], opponents),
        set(['cardPile'], cardsInPile),
        set(['playerTurn'], playerTurnPosition),
      )(state);

      return newState;
    }

    if (action.name === ServerEvent.AddOpponent) {
      const { opponent } = action.value;
      console.log('add opponent', opponent);
      return set(['opponents'], [...state.opponents, opponent])(state);
    }

    if (action.name === ServerEvent.UpdateOpponent) {
      const { opponent } = action.value;

      const updatedOpponents = state.opponents.map(orgOpponent =>
        orgOpponent.id === opponent.id ? opponent : orgOpponent,
      );

      return set(['opponents'], updatedOpponents)(state);
    }

    if (action.name === ServerEvent.RemoveOpponent) {
      const { id } = action.value;
      const newOpponents = state.opponents.filter(opponent => opponent.id !== id);

      return set(['opponents'], [...newOpponents])(state);
    }

    if (action.name === ServerEvent.PlayerPlaysCard) {
      const { newCards } = action.value;

      return set(['player', 'cards'], newCards)(state);
    }

    if (action.name === ServerEvent.AddCardToPile) {
      const { card } = action.value;
      const newState = { ...state };

      // Limit number of visible cards in pile for better performance.
      if (newState.cardPile.length > maxNumberOfPileCards) {
        newState.cardPile.shift();
      }

      return set(['cardPile'], [...state.cardPile, card])(newState);
    }

    if (action.name === ServerEvent.SetPlayerTurn) {
      const { position } = action.value;

      return set(['playerTurn'], position)(state);
    }

    if (action.name === ServerEvent.PlayerPickedUpCard) {
      const { card } = action.value;

      return set(['player', 'cards'], [...state.player.cards, card])(state);
    }

    if (action.name === ServerEvent.PlayerWins) {
      alert('You did it! You are the champ!');
    }

    if (action.name === ServerEvent.OpponentWins) {
      alert(`Darnit! Your opponnent just won. What a bummer!`);
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
