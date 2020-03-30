import React, { useContext } from 'react';
import Card from './components/Card';
import Table from './components/Table';
import { doCardsMatch } from './utils';
import CardPile from './components/CardPile';
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
    const isPlayerInGame = !state.player.hasExitedGame;
    if (!isPlayerInGame || !isPlayersTurn) return;

    if (doCardsMatch(cardInHand, state.topCard)) {
      dispatch({
        name: Action.PlayerPlaysCard,
        value: { cardIndex },
      });
      dispatch({ name: Action.HandleAnyPlayerOutOfCards });
      dispatch({ name: Action.SetNextPlayerTurn });
    }
  };

  return (
    <>
      {state.opponents.map((opponent, index) => (
        <Hand key={index} tablePosition={opponent.position} cardsCount={opponent.cards.length}>
          {opponent.cards.map((card, index) => (
            <Card key={index} color={card.color} value={card.value} isConcealed={card.isConcealed} />
          ))}
        </Hand>
      ))}

      <Table>
        <CardPile />
        <Card color={state.topCard.color} value={state.topCard.value} isConcealed={false} />
      </Table>

      <Hand tablePosition={TablePosition.Player} cardsCount={state.player.cards.length}>
        {state.player.cards.map((card, index) => (
          // <span key={index} onClick={() => placeCardFromHand(card, index)}>
          <Card
            key={index}
            color={card.color}
            value={card.value}
            isConcealed={card.isConcealed}
            onClick={() => placeCardFromHand(card, index)}
          />
          // </span>
        ))}
      </Hand>
    </>
  );
};

export default App;
