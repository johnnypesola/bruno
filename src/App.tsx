import React, { useContext } from 'react';
import Card from './components/Card';
import Table from './components/Table';
import Hand from './components/Hand';
import { doCardsMatch } from './utils';
import CardPile from './components/CardPile';
import { CardInHand } from './types/commonTypes';
import { GameStateContext } from '.';
import { Action } from './types/gameStateActionTypes';
import useAIPlayers from './hooks/useAIPlayers';

interface OpponentsCardsInHand {
  name: string;
  cards: CardInHand[];
}

const App: React.FC = () => {
  const { state, dispatch } = useContext(GameStateContext);
  useAIPlayers();

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number): void => {
    if (doCardsMatch(cardInHand, state.topCard)) {
      dispatch({
        name: Action.PlayerPlaysCard,
        value: { cardIndex },
      });
      dispatch({ name: Action.SetNextPlayerTurn });
    }
  };

  return (
    <>
      {state.opponents.map((opponent, index) => (
        <Hand key={index}>
          {opponent.cards.map((card, index) => (
            <span key={index}>
              <Card color={card.color} value={card.value} />
            </span>
          ))}
        </Hand>
      ))}
      <Table>
        <CardPile />
        <Card color={state.topCard.color} value={state.topCard.value} />
      </Table>
      <Hand>
        {state.player.cards.map((card, index) => (
          <span key={index} onClick={() => placeCardFromHand(card, index)}>
            <Card color={card.color} value={card.value} />
          </span>
        ))}
      </Hand>
    </>
  );
};

export default App;
