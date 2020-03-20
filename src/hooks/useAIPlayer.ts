// import { useState } from 'react';
// import { getInitialHand, doCardsMatch, getRandomCard } from '../utils';
// import { CardInHand } from '../types/commonTypes';

// export interface AIPlayer {
//   cardsInHand: CardInHand[];
//   playTurn: (topCard: CardInHand) => void;
// }

// const useAIPlayer = (opponentIndex: number): AIPlayer => {
//   const [cardsInHand, setCardsInHand] = useState<CardInHand[]>(getInitialHand());

//   const getMatchingCardIndex = (topCard: CardInHand): number =>
//     cardsInHand.findIndex(card => doCardsMatch(card, topCard));

//   const playTurn = (topCard: CardInHand): void => {
//     const cardToPlayIndex = getMatchingCardIndex(topCard);

//     if (cardToPlayIndex !== -1) {
//       // actions.setTopCard(cardsInHand[cardToPlayIndex]);
//       setCardsInHand(cardsInHand.slice(cardToPlayIndex, 1));
//     } else {
//       const newHand = [...cardsInHand, getRandomCard()];
//       setCardsInHand(newHand);
//     }
//   };

//   return {
//     cardsInHand,
//     playTurn,
//   };
// };

// export default useAIPlayer;
export const say = 'helllo';
