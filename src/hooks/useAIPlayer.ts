import { useState } from 'react';
import { CardInHand } from '../App';
import { getInitalHand, doCardsMatch, getRandomCard } from '../utils';

interface Actions {
  setTopCard: React.Dispatch<React.SetStateAction<CardInHand>>;
}

export interface AIPlayer {
  cardsInHand: CardInHand[];
  playTurn: (topCard: CardInHand) => void;
}

const useAIPlayer = (actions: Actions): AIPlayer => {
  const [cardsInHand, setCardsInHand] = useState<CardInHand[]>(getInitalHand());

  const getMatchingCardIndex = (topCard: CardInHand): number =>
    cardsInHand.findIndex(card => doCardsMatch(card, topCard));

  const playTurn = (topCard: CardInHand): void => {
    const cardToPlayIndex = getMatchingCardIndex(topCard);

    if (cardToPlayIndex !== -1) {
      actions.setTopCard(cardsInHand[cardToPlayIndex]);
      cardsInHand.splice(cardToPlayIndex, 1);
    } else {
      setCardsInHand([...cardsInHand, getRandomCard()]);
    }
  };

  return {
    cardsInHand,
    playTurn,
  };
};

export default useAIPlayer;
