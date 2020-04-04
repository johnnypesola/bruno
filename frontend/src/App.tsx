import React, { useContext, useEffect, useRef } from 'react';
import Card from './components/Card';
import Table from './components/Table';
import { doCardsMatch, getTopCard } from './utils';
import CardDeck from './components/CardDeck';
import { CardInHand, TablePosition, Opponent, CardColor, CardValue } from './types/commonTypes';
import { GameStateContext } from '.';
import { Action } from './types/gameStateActionTypes';
import useAIPlayers from './hooks/useAIPlayers';
import Hand from './components/Hand';
import CardPile from './components/CardPile';

import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import styled from 'styled-components';

const App: React.FC = () => {
  const { state, dispatch } = useContext(GameStateContext);
  const feathersApp = useRef(feathers())

  useEffect(() => {
      const socket = io('http://localhost:3030');
      
      const app = feathers();
      app.configure(feathers.socketio(socket));
      app.configure(feathers.authentication());
  
      app.service('player').find({
        text: 'A new message'
      });
  
      // Receive real-time events through Socket.io
      app.service('player')
        .on('playerAdded', (message:string) => console.log(message));
  
      feathersApp.current =  app;
  }, [])
  

  const getMessages = () => {
    feathersApp.current.service('player').find().then((response: string) => console.log(response));
  };

  useAIPlayers();

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number): void => {
    const isPlayersTurn = state.playerTurn === -1;
    const isPlayerInGame = !state.player.hasExitedGame;
    if (!isPlayerInGame || !isPlayersTurn) return;

    if (doCardsMatch(cardInHand, getTopCard(state.cardPile))) {
      dispatch({
        name: Action.PlayerPlaysCard,
        value: { cardIndex },
      });
      dispatch({ name: Action.HandleAnyPlayerOutOfCards });
      setTimeout(() => dispatch({ name: Action.SetNextPlayerTurn }), 1000);
    }
  };

  useEffect(() => {
    if (state.playerTurn === -1) dispatch({ name: Action.HandleCardEffectForPlayer });
  }, [state.cardPile, state.playerTurn, dispatch]);

  const GetMessagesButton = styled.button`
    position: fixed;
    top: 10px;
    left: 10px;
    border: 5px solid pink;
  `

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

      <Hand tablePosition={TablePosition.Player} cardsCount={state.player.cards.length}>
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
      <GetMessagesButton onClick={() => getMessages()}>Get messages!</GetMessagesButton>
    </>
  );
};

export default App;
