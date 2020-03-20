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
    console.log(state.playerTurn);
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

  // const playTurn = (topCard: CardInHand): void => {
  //   const cardToPlayIndex = getMatchingCardIndex(topCard);

  //   if (cardToPlayIndex !== -1) {
  //     // actions.setTopCard(cardsInHand[cardToPlayIndex]);
  //     setCardsInHand(cardsInHand.slice(cardToPlayIndex, 1));
  //   } else {
  //     const newHand = [...cardsInHand, getRandomCard()];
  //     setCardsInHand(newHand);
  //   }
  // };
};

export default useAIPlayers;
