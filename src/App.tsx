import React, { useContext } from 'react';
import Card from './components/Card';
import Table from './components/Table';
import { doCardsMatch } from './utils';
import CardDeck from './components/CardDeck';
import { CardInHand, TablePosition } from './types/commonTypes';
import { GameStateContext } from '.';
import { Action } from './types/gameStateActionTypes';
import useAIPlayers from './hooks/useAIPlayers';
import Hand from './components/Hand';

const App: React.FC = () => {
  const { state, dispatch } = useContext(GameStateContext);
  useAIPlayers();

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number): void => {
    const isPlayersTurn = state.playerTurn === -1;
    if (!isPlayersTurn) return;

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
        <Hand key={index} tablePosition={opponent.position}>
          {opponent.cards.map((card, index) => (
            <span key={index}>
              <Card color={card.color} value={card.value} isConcealed={card.isConcealed} />
            </span>
          ))}
        </Hand>
      ))}

      <Table>
        <CardDeck />
        <Card color={state.topCard.color} value={state.topCard.value} isConcealed={false} />
      </Table>

      <Hand tablePosition={TablePosition.Player}>
        {state.player.cards.map((card, index) => (
          <span key={index} onClick={() => placeCardFromHand(card, index)}>
            <Card color={card.color} value={card.value} isConcealed={card.isConcealed} />
          </span>
        ))}
      </Hand>
    </>
  );
};

export default App;
