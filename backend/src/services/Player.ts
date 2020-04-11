import { Player } from '../../../src/types/commonTypes';
import { getInitialHand } from '../../utils';
import { PlayerEvent } from '../../../src/types/events';

export class PlayerService {
  players: Player[];

  constructor() {
    this.players = [];
    (this as any).events = ['playerAdded', 'playerRemoved'];
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

    (this as any).emit(PlayerEvent.PlayerAdded, id);
    return id;
  }

  async removePlayer(id: string): Promise<string> {
    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    (this as any).emit('playerRemoved', id);
    return id;
  }
}
