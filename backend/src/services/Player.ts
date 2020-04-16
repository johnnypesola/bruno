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
    this.playerTurnPosition = 0;
  }

  // async getPlayers(): Promise<Player[]> {
  //   return this.players;
  // }

  async playCard(id: userId, cardIndex: number, socket: any): Promise<void> {
    const player = this.players.find(player => player.id === id);
    const cardToPlay = player.cards[cardIndex];

    console.log('is players turn', this.isPlayersTurn(id));
    if (!this.isPlayersTurn(id)) return;

    this.canPlayCard(cardToPlay).then(() => {
      console.log('player can play card');
      const playedCard = player.cards.splice(cardIndex, 1)[0];
      this.api.service<CardPileService>(ServiceName.CardPile).addCardToPile(playedCard);

      socket.emit(PlayerEvent.PlayedCard, cardIndex);

      // Emit update to opponents about players cards.
      const opponent: Opponent = {
        ...player,
        cards: player.cards.map(() => null),
      };

      socket.broadcast.emit(OpponentEvent.OpponentUpdate, opponent);

      this.nextPlayersTurn();
    });
  }

  async addPlayer(id: string): Promise<string> {
    const newPlayer = {
      id,
      cards: getInitialHand(false),
      hasExitedGame: false,
      position: this.getFreeTablePosition(),
    };
    const newPlayerAsOpponent: Opponent = { ...newPlayer, cards: newPlayer.cards.map(() => null) };

    const opponents: Opponent[] = this.players.map(player => {
      return { ...player, cards: player.cards.map(() => null) };
    });

    this.players.push(newPlayer);
    console.log(`Added player for client with id: ${id} (table position: ${newPlayer.position})`);

    const initPlayerData: InitPlayerData = { newPlayer, opponents };

    this.api.emit(PlayerEvent.PlayerInit, initPlayerData);
    this.api.emit(OpponentEvent.OpponentAdded, newPlayerAsOpponent);
    return id;
  }

  async removePlayer(id: string): Promise<string> {
    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    this.api.emit(PlayerEvent.PlayerRemoved, id);
    return id;
  }

  private getFreeTablePosition = (): number => {
    let freePos = 0;
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

    if (canPlay) return Promise.resolve();
  }

  private isPlayersTurn(id: userId): boolean {
    return this.players.find(player => player.id === id).position === this.playerTurnPosition;
  }

  private nextPlayersTurn(): void {
    const maxPos = this.players.length - 1;
    const nextPos = this.playerTurnPosition + 1;
    this.playerTurnPosition = nextPos <= maxPos ? nextPos : 0;

    this.api.emit(PlayerEvent.NextPlayerTurn, this.playerTurnPosition);
  }
}
