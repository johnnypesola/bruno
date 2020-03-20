import { useState } from 'react';
import { getInitialHand, doCardsMatch, getRandomCard } from '../utils';
import React from 'react';
import Hand from './Hand';
import Card from './Card';
import { CardInHand } from '../types/commonTypes';

interface AIPlayerProps {
  setTopCard: React.Dispatch<React.SetStateAction<CardInHand>>;
}

// export interface AIPlayer {
//   getCardsInHand: () => CardInHand[];
//   playTurn: (topCard: CardInHand) => void;
// }

const AIPlayer: React.FC<AIPlayerProps> = ({ setTopCard }) => {
  const [cardsInHand, setCardsInHand] = useState<CardInHand[]>(getInitialHand());

  const getMatchingCardIndex = (topCard: CardInHand): number =>
    cardsInHand.findIndex(card => doCardsMatch(card, topCard));

  const playTurn = (topCard: CardInHand): void => {
    const cardToPlayIndex = getMatchingCardIndex(topCard);

    console.log('cardToPlayIndex', cardToPlayIndex);

    if (cardToPlayIndex !== -1) {
      setTopCard(cardsInHand[cardToPlayIndex]);
      setCardsInHand(cardsInHand.slice(cardToPlayIndex, 1));
    } else {
      const newHand = [...cardsInHand, getRandomCard()];
      console.log('setCardsInHand', newHand);
      setCardsInHand(newHand);
      console.log('cardsInHand', cardsInHand);
    }
  };

  return (
    <Hand>
      {cardsInHand.map((card, index) => (
        <span key={index}>
          <Card color={card.color} value={card.value} />
        </span>
      ))}
    </Hand>
  );
};

export default AIPlayer;
