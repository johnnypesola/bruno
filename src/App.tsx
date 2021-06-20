import React, { useContext } from 'react';
import Card from './components/Card';
import Table from './components/Table';
import CardDeck from './components/CardDeck';
import { CardInHand, Opponent, CardColor, CardValue } from './types/commonTypes';
import { GameStateContext } from '.';
import Hand from './components/Hand';
import CardPile from './components/CardPile';
import useApi from './hooks/useApi';
import { ClientEvent } from './types/clientEventTypes';
import Toaster from './components/Toaster';

const App: React.FC = () => {
  const { state } = useContext(GameStateContext);

  const socket = useApi();

  const canPlay = (): boolean => {
    const isPlayersTurn = state.playerTurn === state.player.position;
    const isPlayerInGame = !state.player.hasExitedGame;
    return isPlayerInGame && isPlayersTurn;
  };

  const PickUpCard = (): void => {
    if (!canPlay()) return;
    socket.emit(ClientEvent.PicksUpCard);
  };

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number): void => {
    if (!canPlay()) return;

    socket.emit(ClientEvent.PlaysCard, cardIndex);
  };

  return (
    <>
      {state.opponents.map((opponent: Opponent, index) => (
        <Hand
          key={index}
          isHighlighted={state.playerTurn === opponent.position}
          tablePosition={opponent.position}
          cardsCount={opponent.cards.length}
          numberOfPlayers={state.opponents.length + 1}
        >
          {opponent.cards.map((card, index) => (
            <Card key={index} color={CardColor.Blue} value={CardValue.Eight} isConcealed={true} />
          ))}
        </Hand>
      ))}

      <Table>
        <CardDeck onClick={() => PickUpCard()} />
        <CardPile />
      </Table>

      <Hand
        isHighlighted={state.playerTurn === state.player.position}
        tablePosition={0}
        cardsCount={state.player.cards.length}
        numberOfPlayers={state.opponents.length + 1}
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
      <Toaster message={state.toasterMessage} />
    </>
  );
};

export default App;
