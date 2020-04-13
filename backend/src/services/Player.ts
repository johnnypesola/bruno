import { Player } from '../../../src/types/commonTypes';
import { getInitialHand } from '../../utils';
import { PlayerEvent } from '../../../src/types/events';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';

export interface InitPlayerData {
  newPlayer: Player;
  otherPlayers: Player[];
}

export class PlayerService extends BaseService {
  players: Player[];

  constructor(api: ApiServer) {
    super(api);
    this.players = [];
  }

  // async getPlayers(): Promise<Player[]> {
  //   return this.players;
  // }

  async playCard(cardIndex: number, something): Promise<void> {
    console.log(cardIndex, something);
  }

  async addPlayer(id: string): Promise<string> {
    const newPlayer = {
      id,
      cards: getInitialHand(false),
      hasExitedGame: false,
      position: this.getFreeTablePosition(this.players),
    };

    const otherPlayers = [...this.players];

    this.players.push(newPlayer);
    console.log(`Added player for client with id: ${id} (table position: ${newPlayer.position})`);

    const initPlayerData: InitPlayerData = { newPlayer, otherPlayers };

    this.api.emit(PlayerEvent.PlayerInit, initPlayerData);
    this.api.emit(PlayerEvent.PlayerAdded, newPlayer);
    return id;
  }

  async removePlayer(id: string): Promise<string> {
    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    this.api.emit(PlayerEvent.PlayerRemoved, id);
    return id;
  }

  private getFreeTablePosition = (players: Player[]): number => {
    let freePos = 1;
    const takenPositions = players.map(player => player.position).sort();
    takenPositions.every(pos => {
      if (freePos === pos) {
        freePos = pos + 1;
        return true;
      }
    });
    return freePos;
  };
}
