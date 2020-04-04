import { CardInHand, CardInPile, Player } from "../../frontend/src/types/commonTypes";
import { getRandomCard, toPileCard, getInitialHand } from "../utils";
import { Service, Params, ServiceOverloads } from "@feathersjs/feathers";

export enum ApiService {
  CardPile = "cardpile",
  Player = "player"
}

export class CardPileService {
  cardsInPile: CardInPile[] = [toPileCard(getRandomCard())];

  async find () {
    return this.cardsInPile;
  }

  async addCardToPile(card: CardInHand) {
    this.cardsInPile.push(toPileCard(card));
    console.log(`Added card (${card.value} ${card.color}) to pile`); 
  }




  // async create (card: CardInHand) {
  //   this.cards.push(toPileCard(card));
  //   console.log(`Added card (${card.value} ${card.color}) to pile`);
  // }
}

export class PlayerService {
  players: Player[];

  constructor() {
    this.players = [];
    (this as any).events = ['playerAdded']
  }

  async find () {
    return this.players;
  }

  async addPlayer (id: string) {
    this.players.push({
      id,
      cards: getInitialHand(false), hasExitedGame: false
    })
    console.log(`Added player for client with id: ${id}`);
    
    (this as any).emit('playerAdded', id);
    return id;
  }

  async removePlayer (id: string) {
    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);
  }
}