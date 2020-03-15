import React, { useState } from 'react';
import Card, { CardColor, CardValue } from './components/Card';
import CardPile, { getRandomCard } from './components/CardPile';
import Table from './components/Table';
import Hand from './components/Hand';

export interface CardInHand {
  color: CardColor;
  value: CardValue;
}

function App() {

  const getInitalHand = () => {
    const initialNumberOfCardsInHand = 7;
    const initialHand: CardInHand[] = [];
  
    while(initialHand.length < initialNumberOfCardsInHand) {
      initialHand.push(getRandomCard())
    }

    return initialHand;
  }

  const [cardsInHand, setCardsInHand] = useState<CardInHand[]>(getInitalHand());
  const [topCard, setTopCard] = useState<CardInHand>(getRandomCard());

  const onGetCardHandler = (newCard: CardInHand) => setCardsInHand([...cardsInHand, newCard])

  const placeCardFromHand = (cardInHand: CardInHand, cardIndex: number) => {

    if (cardInHand.color == topCard.color || cardInHand.value == topCard.value){
      setTopCard(cardInHand);
      cardsInHand.splice(cardIndex, 1);  
    }

  }

  return (
    <>
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
