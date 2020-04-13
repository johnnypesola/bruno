import React, { useContext, useEffect, useRef } from 'react';
import Card from './components/Card';
import Table from './components/Table';
import { doCardsMatch, getTopCard } from './utils';
import CardDeck from './components/CardDeck';
import { CardInHand, Opponent, CardColor, CardValue } from './types/commonTypes';
import { GameStateContext } from '.';
import { Action } from './types/gameStateActionTypes';
import useAIPlayers from './hooks/useAIPlayers';
import Hand from './components/Hand';
import CardPile from './components/CardPile';

import styled from 'styled-components';
import useApi from './hooks/useApi';
import { ServiceName } from './types/services';
import { PlayerEvent } from './types/events';

const App: React.FC = () => {
  const { state, dispatch } = useContext(GameStateContext);

  const socket = useApi();
  // useAIPlayers();

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number): void => {
    const isPlayersTurn = state.playerTurn === -1;
    const isPlayerInGame = !state.player.hasExitedGame;
    if (!isPlayerInGame || !isPlayersTurn) return;

    socket.emit(PlayerEvent.PlayCard, cardIndex);

    // if (doCardsMatch(cardInHand, getTopCard(state.cardPile))) {
    //   dispatch({
    //     name: Action.PlayerPlaysCard,
    //     value: { cardIndex },
    //   });
    //   dispatch({ name: Action.HandleAnyPlayerOutOfCards });
    //   setTimeout(() => dispatch({ name: Action.SetNextPlayerTurn }), 1000);
    // }
  };

  useEffect(() => {
    if (state.playerTurn === -1) dispatch({ name: Action.HandleCardEffectForPlayer });
  }, [state.cardPile, state.playerTurn, dispatch]);

  const GetMessagesButton = styled.button`
    position: fixed;
    top: 10px;
    left: 10px;
    border: 5px solid pink;
  `;

  return (
    <>
      {state.opponents.map((opponent: Opponent, index) => (
        <Hand key={index} tablePosition={opponent.position} cardsCount={opponent.cards.length}>
          {opponent.cards.map((card, index) => (
            <Card key={index} color={CardColor.Blue} value={CardValue.Eight} isConcealed={true} />
          ))}
        </Hand>
      ))}

      <Table>
        <CardDeck />
        <CardPile />
      </Table>

      <Hand tablePosition={0} cardsCount={state.player.cards.length}>
        {state.player.cards.map((card, index) => (
          <Card
            key={index}
            color={card.color}
            value={card.value}
            isConcealed={card.isConcealed}
            onClick={() => placeCardFromHand(card, index)}
          />
        ))}
      </Hand>
    </>
  );
};

export default App;
