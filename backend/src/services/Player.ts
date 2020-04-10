import { Player } from '../../../src/types/commonTypes';
import { getInitialHand } from '../../utils';

export class PlayerService {
  players: Player[];

  constructor() {
    this.players = [];
    (this as any).events = ['playerAdded'];
  }

  async find(): Promise<Player[]> {
    return this.players;
  }

  async addPlayer(id: string): Promise<string> {
    this.players.push({
      id,
      cards: getInitialHand(false),
      hasExitedGame: false,
    });
    console.log(`Added player for client with id: ${id}`);

    (this as any).emit('playerAdded', id);
    return id;
  }

  async removePlayer(id: string): Promise<void> {
    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);
  }
}
