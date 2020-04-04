import { CardInHand } from "../../frontend/src/types/commonTypes";
import { getRandomCard } from "../utils";

interface Player {
  id: string;
  cards: CardInHand[]
}

interface GameState {
  players: Player[]
  cardPile: CardInHand[]
}

// const initGameState = () => {
//   const state: GameState = {
//     players: [],
//     cardPile: [getRandomCard(false)]
//   }
// }