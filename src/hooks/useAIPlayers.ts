import { useContext } from 'react';
import { doCardsMatch } from '../utils';
import { GameStateContext } from '..';
import useInterval from './useInterval';
import { Action } from '../types/gameStateActionTypes';

const useAIPlayers = (): void => {
  const { state, dispatch } = useContext(GameStateContext);
  const topCard = state.cardDeck[0];
  const getMatchingCardIndex = (): number =>
    state.opponents[state.playerTurn].cards.findIndex(card => doCardsMatch(card, topCard));

  // Game loop
  useInterval(() => {
    const isAIPlayersTurn = state.playerTurn !== -1;

    if (isAIPlayersTurn) {
      const cardIndex = getMatchingCardIndex();

      if (cardIndex !== -1) {
        dispatch({
          name: Action.OpponentPlaysCard,
          value: { cardIndex, opponentIndex: state.playerTurn },
        });
      } else {
        dispatch({
          name: Action.OpponentDrawsCard,
          value: { opponentIndex: state.playerTurn },
        });
      }

      dispatch({ name: Action.SetNextPlayerTurn });
    }
  }, 1000);
};

export default useAIPlayers;
