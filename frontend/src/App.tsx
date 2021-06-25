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

  const pickUpCard = (): void => {
    if (!canPlay()) return;
    socket.emit(ClientEvent.PickUpCard);
  };

  const playCard = (cardInHand: CardInHand, cardIndex: number): void => {
    if (!canPlay()) return;

    socket.emit(ClientEvent.PlayCard, cardIndex);
  };

  const playSelectedCards = (): void => {
    if (!canPlay()) return;
    socket.emit(ClientEvent.PlaySelectedCards);
  };

  const selectCard = (isSelected: boolean, cardInHand: CardInHand, cardIndex: number): void => {
    if (!canPlay()) return;

    socket.emit(ClientEvent.SelectCard, cardIndex, isSelected);
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
            <Card
              key={index}
              color={CardColor.Blue}
              value={CardValue.Eight}
              isConcealed={true}
              isSelected={card.isSelected}
            />
          ))}
        </Hand>
      ))}

      <Table>
        <CardDeck onClick={() => pickUpCard()} />
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
            onClick={() => (card.isSelected ? playSelectedCards() : playCard(card, index))}
            onDragUp={() => !card.isSelected && selectCard(true, card, index)}
            onDragDown={() => card.isSelected && selectCard(false, card, index)}
            isSelected={card.isSelected}
          />
        ))}
      </Hand>
      <Toaster message={state.toasterMessage} />
    </>
  );
};

export default App;
