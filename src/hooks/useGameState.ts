import { useReducer, Dispatch } from 'react';
import {
  getInitialHand,
  getRandomCard,
  getShuffledDeck,
  removeTopCardFromDeck,
  getTopCardInDeck,
  removeCardFromHand,
} from '../utils';
import set from 'lodash/fp/set';
import { flow } from 'lodash/fp';
import {
  GameStateAction,
  PlayerPlaysCardAction,
  Action,
  OpponentPlaysCardAction,
  OpponentDrawsCardAction,
} from '../types/gameStateActionTypes';
import { GameState, TablePosition, CardInHand } from '../types/commonTypes';
import { CardColor } from '../components/Card';
import CardDeck from '../components/CardDeck';

const useGameState = (): [GameState, Dispatch<GameStateAction>] => {
  const reducer = (state: GameState, action: GameStateAction): GameState => {
    if (action.name === Action.PlayerPlaysCard) {
      const { cardIndex } = (action as PlayerPlaysCardAction).value;
      const newCards = removeCardFromHand(state.player.cards, cardIndex);
      return set(['player', 'cards'], newCards)(state);
    }

    if (action.name === Action.OpponentPlaysCard) {
      const { cardIndex, opponentIndex } = (action as OpponentPlaysCardAction).value;
      const opponent = state.opponents[opponentIndex];
      const newCards = removeCardFromHand(opponent.cards, cardIndex);
      return set(['opponents', opponentIndex, 'cards'], newCards)(state);
    }

    if (action.name === Action.OpponentDrawsCard) {
      const { opponentIndex } = (action as OpponentDrawsCardAction).value;
      const newCard = getTopCardInDeck(state.cardDeck);
      const cardDeck = removeTopCardFromDeck(state.cardDeck);

      return flow(
        set(['cardDeck'], cardDeck),
        set(['opponents', opponentIndex, 'cards'], [...state.opponents[opponentIndex].cards, newCard]),
      )(state);
    }

    if (action.name === Action.SetNextPlayerTurn) {
      const nextPlayerIndex = state.playerTurn >= state.opponents.length - 1 ? -1 : state.playerTurn + 1;
      return set(['playerTurn'], nextPlayerIndex)(state);
    }

    if (action.name === Action.PlayerDrawsNewCard) {
      const newCard = getTopCardInDeck(state.cardDeck);
      newCard.isConcealed = false;
      const cardDeck = removeTopCardFromDeck(state.cardDeck);
      return flow(set(['player', 'cards'], [...state.player.cards, newCard]), set(['cardDeck'], cardDeck))(state);
    }

    // Default fallback
    return state;
  };

  const initialGameState: GameState = {
    player: { cards: getInitialHand(false) },
    opponents: [
      { name: 'Benny', cards: getInitialHand(), position: TablePosition.OpponentLeft },
      { name: 'Fanny', cards: getInitialHand(), position: TablePosition.OpponentRight },
    ],
    cardDeck: getShuffledDeck(),
    playerTurn: -1,
  };

  return useReducer(reducer, initialGameState);
};

export default useGameState;
