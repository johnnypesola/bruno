import React, { useState } from 'react';
import Card, { CardColor, CardValue } from './components/Card';
import CardPile, { getRandomCard } from './components/CardPile';

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

  const [hand, setHand] = useState<CardInHand[]>(getInitalHand());

  const onGetCardHandler = (newCard: CardInHand) => setHand([...hand, newCard])

  return (
    <>
      <div><CardPile onGetCard={onGetCardHandler}/></div>
      <div>
        {hand.map(card => 
            <Card color={card.color} value={card.value} />
          )}
      </div>
    </>
  );
}

export default App;
