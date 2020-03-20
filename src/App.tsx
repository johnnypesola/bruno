import React, { useState } from 'react';
import Card, { CardColor, CardValue } from './components/Card';
import Table from './components/Table';
import Hand from './components/Hand';
import { getInitalHand, getRandomCard, doCardsMatch } from './utils';
import CardPile from './components/CardPile';
import useAIPlayer, { AIPlayer } from './hooks/useAIPlayer';
import useInterval from './hooks/useInterval';

export interface CardInHand {
  color: CardColor;
  value: CardValue;
}

const App: React.FC = () => {
  const [cardsInHand, setCardsInHand] = useState<CardInHand[]>(getInitalHand());
  const [topCard, setTopCard] = useState<CardInHand>(getRandomCard());
  const [playerTurn, setPlayerTurn] = useState(0);
  const [opponents] = useState<AIPlayer[]>([useAIPlayer({ setTopCard }), useAIPlayer({ setTopCard })]);

  const onGetCardHandler = (newCard: CardInHand): void => {
    setCardsInHand([...cardsInHand, newCard]);
    setPlayerTurn(1);
  };

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number): void => {
    if (doCardsMatch(cardInHand, topCard)) {
      setTopCard(cardInHand);
      cardsInHand.splice(cardIndex, 1);
      setPlayerTurn(1);
    }
  };

  // Game loop
  useInterval(() => {
    if (playerTurn !== 0) {
      // opponent.playTurn(topCard);
      setPlayerTurn(0);
    }
  }, 1000);

  return (
    <>
      {opponents.map((opponent, index) => (
        <Hand key={index}>
          {opponent.cardsInHand.map((card, index) => (
            <span
              key={index}
              onClick={() => {
                placeCardFromHand(card, index);
              }}
            >
              <Card color={card.color} value={card.value} />
            </span>
          ))}
        </Hand>
      ))}
      <Table>
        <CardPile onGetCard={onGetCardHandler} />
        <Card color={topCard.color} value={topCard.value} />
      </Table>
      <Hand>
        {cardsInHand.map((card, index) => (
          <span key={index} onClick={() => placeCardFromHand(card, index)}>
            <Card color={card.color} value={card.value} />
          </span>
        ))}
      </Hand>
    </>
  );
};

export default App;
