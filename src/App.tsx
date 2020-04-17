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
    const isPlayersTurn = state.playerTurn === state.player.position;
    const isPlayerInGame = !state.player.hasExitedGame;
    if (!isPlayerInGame || !isPlayersTurn) return;

    console.log('Playing card! emitting stuff!');

    socket.emit(PlayerEvent.PlaysCard, cardIndex);

    // if (doCardsMatch(cardInHand, getTopCard(state.cardPile))) {
    //   dispatch({
    //     name: Action.PlayerPlaysCard,
    //     value: { cardIndex },
    //   });
    //   dispatch({ name: Action.HandleAnyPlayerOutOfCards });
    //   setTimeout(() => dispatch({ name: Action.SetPlayerTurn }), 1000);
    // }
  };

  const GetMessagesButton = styled.button`
    position: fixed;
    top: 10px;
    left: 10px;
    border: 5px solid pink;
  `;

  return (
    <>
      {state.opponents.map((opponent: Opponent, index) => (
        <Hand
          key={index}
          isHighlighted={state.playerTurn === opponent.position}
          tablePosition={opponent.position}
          cardsCount={opponent.cards.length}
        >
          {opponent.cards.map((card, index) => (
            <Card key={index} color={CardColor.Blue} value={CardValue.Eight} isConcealed={true} />
          ))}
        </Hand>
      ))}

      <Table>
        <CardDeck />
        <CardPile />
      </Table>

      <Hand
        isHighlighted={state.playerTurn === state.player.position}
        tablePosition={0}
        cardsCount={state.player.cards.length}
      >
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
      <span style={{ position: 'fixed', top: '10px', left: '10px' }}>
        playerTurn {state.playerTurn} | player position {state.player.position}
      </span>
    </>
  );
};

export default App;
