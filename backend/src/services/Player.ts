import { Player, InitPlayerData, Opponent, CardInHand } from '../../../src/types/commonTypes';
import { getInitialHand } from '../../utils';
import { PlayerEvent, OpponentEvent } from '../../../src/types/events';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';
import { userId } from '../eventListeners';
import { ServiceName } from '../../../src/types/services';
import { CardPileService } from './CardPile';

export class PlayerService extends BaseService {
  players: Player[];
  playerTurnPosition: number;

  constructor(api: ApiServer) {
    super(api);
    this.players = [];
    this.playerTurnPosition = 1;
  }

  // async getPlayers(): Promise<Player[]> {
  //   return this.players;
  // }

  async playCard(id: userId, cardIndex: number, socket: any): Promise<void> {
    const player = this.players.find(player => player.id === id);
    const cardToPlay = player.cards[cardIndex];

    console.log('is players turn', this.isPlayersTurn(id));
    console.log('playerTurnPosition', this.playerTurnPosition);
    if (!this.isPlayersTurn(id)) return;

    this.canPlayCard(cardToPlay)
      .then(() => {
        const playedCard = player.cards.splice(cardIndex, 1)[0];
        this.api.service<CardPileService>(ServiceName.CardPile).addCardToPile(playedCard);

        socket.emit(PlayerEvent.PlayedCard, player.cards);

        // Emit update to opponents about players cards.
        const opponent: Opponent = {
          ...player,
          cards: player.cards.map(() => null),
        };

        socket.broadcast.emit(OpponentEvent.OpponentUpdate, opponent);

        this.nextPlayersTurn();
      })
      .catch(() => {});
  }

  async addPlayer(id: string, socket: any): Promise<string> {
    const newPlayer = {
      id,
      cards: getInitialHand(false),
      hasExitedGame: false,
      position: this.getFreeTablePosition(),
    };
    const newPlayerAsOpponent: Opponent = { ...newPlayer, cards: newPlayer.cards.map(() => null) };

    const opponents: Opponent[] = this.players
      .filter(player => player.id !== id)
      .map(player => {
        return { ...player, cards: player.cards.map(() => null) };
      });

    this.players.push(newPlayer);
    console.log(`Added player for client with id: ${id} (table position: ${newPlayer.position})`);

    const cardsInPile = this.api.service<CardPileService>(ServiceName.CardPile).cardsInPile;

    const initPlayerData: InitPlayerData = {
      newPlayer,
      opponents,
      playerTurnPosition: this.playerTurnPosition,
      cardsInPile,
    };

    console.log('this.playerTurnPosition', this.playerTurnPosition);

    socket.emit(PlayerEvent.PlayerInit, initPlayerData);
    socket.broadcast.emit(OpponentEvent.OpponentAdded, newPlayerAsOpponent);
    return id;
  }

  async removePlayer(id: string): Promise<string> {
    const playerToRemove = this.players.find(player => player.id == id);

    if (playerToRemove.position === this.playerTurnPosition) this.nextPlayersTurn();

    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    this.api.emit(OpponentEvent.OpponentRemoved, id);
    return id;
  }

  private getFreeTablePosition = (): number => {
    let freePos = 1;
    const takenPositions = this.players.map(player => player.position).sort();
    takenPositions.every(pos => {
      if (freePos === pos) {
        freePos = pos + 1;
        return true;
      }
    });
    return freePos;
  };

  private async canPlayCard(card: CardInHand): Promise<void> {
    const topCard = await this.api.service<CardPileService>(ServiceName.CardPile).getTopCard();
    const canPlay = topCard.value === card.value || card.color === topCard.color;

    if (canPlay) {
      console.log('player can play card', card);
      return Promise.resolve();
    } else {
      console.log('player cannot play card', card, topCard);
      return Promise.reject();
    }
  }

  private isPlayersTurn(id: userId): boolean {
    return this.players.find(player => player.id === id).position === this.playerTurnPosition;
  }

  private nextPlayersTurn(): void {
    const getNextPlayerPos = (oldPos: number): number => {
      let smallestPosFound: number, nextHigherPos: number;
      for (let i = 0; i < this.players.length; i++) {
        const pos = this.players[i].position;

        if (!smallestPosFound || pos < smallestPosFound) smallestPosFound = pos;
        if (!nextHigherPos && pos > oldPos) {
          nextHigherPos = pos;
          break;
        }
      }
      console.log('nextHigherPos', nextHigherPos);
      console.log('smallestPosFound', smallestPosFound);
      return nextHigherPos || smallestPosFound;
    };

    console.log('playerTurnPosition before', this.playerTurnPosition);
    this.playerTurnPosition = getNextPlayerPos(this.playerTurnPosition);
    console.log('playerTurnPosition after', this.playerTurnPosition);

    console.log('nextPlayerPos', this.playerTurnPosition);

    this.api.emit(PlayerEvent.NextPlayerTurn, this.playerTurnPosition);
  }
}
