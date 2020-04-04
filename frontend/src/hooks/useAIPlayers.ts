import { useContext } from 'react';
import { doCardsMatch, getTopCard, getRandomCard } from '../utils';
import { GameStateContext } from '..';
import useInterval from './useInterval';
import { Action } from '../types/gameStateActionTypes';

const useAIPlayers = (): void => {
  const { state, dispatch } = useContext(GameStateContext);
  const getCardToPlayIndex = (): number => {
    const matchingCardIndex = state.opponents[state.playerTurn].cards.findIndex(card =>
      // doCardsMatch(null, getTopCard(state.cardPile)),
      doCardsMatch(getRandomCard(), getTopCard(state.cardPile)),
    );
    return matchingCardIndex;
  };

  // Game loop
  useInterval(() => {
    const isAIPlayersTurn = state.playerTurn !== -1;

    if (isAIPlayersTurn) {
      const opponentIndex = state.playerTurn;
      const isOpponentInGame = !state.opponents[opponentIndex].hasExitedGame;

      if (isOpponentInGame) {
        const cardIndex = getCardToPlayIndex();

        dispatch({ name: Action.HandleCardEffectForOpponent, value: { opponentIndex } });

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
