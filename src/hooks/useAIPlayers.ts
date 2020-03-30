import { useContext } from 'react';
import { doCardsMatch } from '../utils';
import { GameStateContext } from '..';
import useInterval from './useInterval';
import { Action } from '../types/gameStateActionTypes';

const useAIPlayers = (): void => {
  const { state, dispatch } = useContext(GameStateContext);
  const getMatchingCardIndex = (): number =>
    state.opponents[state.playerTurn].cards.findIndex(card => doCardsMatch(card, state.topCard));

  // Game loop
  useInterval(() => {
    const isAIPlayersTurn = state.playerTurn !== -1;

    if (isAIPlayersTurn) {
      const cardIndex = getMatchingCardIndex();
      const opponentIndex = state.playerTurn;
      const isOpponentInGame = !state.opponents[opponentIndex].hasExitedGame;

      if (isOpponentInGame) {
        if (cardIndex !== -1) {
          dispatch({
            name: Action.OpponentPlaysCard,
            value: { cardIndex, opponentIndex },
          });
        } else {
          dispatch({
            name: Action.OpponentDrawsCard,
            value: { opponentIndex },
          });
        }
      }

      dispatch({ name: Action.HandleAnyPlayerOutOfCards });
      dispatch({ name: Action.SetNextPlayerTurn });
    }
  }, 1000);
};

export default useAIPlayers;
