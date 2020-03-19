import React, { useState } from 'react';
import Card, { CardColor, CardValue } from './components/Card';
import Table from './components/Table';
import Hand from './components/Hand';
import { getInitalHand, getRandomCard } from './utils';
import CardPile from './components/CardPile';
import useAIPlayer from './hooks/useAIPlayer';
import useInterval from './hooks/useInterval';

export interface CardInHand {
  color: CardColor;
  value: CardValue;
}

function App() {

  const [cardsInHand, setCardsInHand] = useState<CardInHand[]>(getInitalHand());
  const [topCard, setTopCard] = useState<CardInHand>(getRandomCard());
  const [playerTurn, setPlayerTurn] = useState(0);

  const opponent = useAIPlayer({ setTopCard })

  const onGetCardHandler = (newCard: CardInHand) => {
    setCardsInHand([...cardsInHand, newCard])
    setPlayerTurn(1);
  }

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number) => {

    if (cardInHand.color == topCard.color || cardInHand.value == topCard.value){
      setTopCard(cardInHand);
      cardsInHand.splice(cardIndex, 1);  
      setPlayerTurn(1);
    }
  }

  // Game loop
  useInterval(() => {
    if(playerTurn !== 0) {
      opponent.playTurn(topCard);
      setPlayerTurn(0);
    }
  }, 1000)

  return (
    <>
      <Hand>
        {opponent.cardsInHand.map((card, index) => 
          <span onClick={() => {placeCardFromHand(card, index)}}>
            <Card color={card.color} value={card.value} />
          </span>)}
      </Hand>
      <Table>
        <CardPile onGetCard={onGetCardHandler} />
        <Card color={topCard.color} value={topCard.value} />
      </Table>
      <Hand>
        {cardsInHand.map((card, index) => 
          <span onClick={() => {placeCardFromHand(card, index)}}>
            <Card color={card.color} value={card.value} />
          </span>
        )}
      </Hand>
    </>
  );
}

export default App;
