import { Player, InitPlayerDataContent, Opponent } from '../../../src/types/commonTypes';
import { ServerEvent } from '../../../src/types/serverEventTypes';
import { getInitialHand, toOpponent } from '../../utils';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';
import { userId } from '../eventListeners';
import { Service } from '../../../src/types/services';
import { CardPileService } from './CardPile';
import { CardEffectService } from './CardEffect';

export class PlayerService extends BaseService {
  players: Player[];
  playerSockets: { [key: string]: any };
  playerTurnPosition: number;

  constructor(api: ApiServer) {
    super(api);
    this.players = [];
    this.playerSockets = {};
    this.playerTurnPosition = 1;
  }

  async playCard(id: userId, cardIndex: number, socket: any): Promise<void> {
    const player = this.players.find(player => player.id === id);
    const cardToPlay = player.cards[cardIndex];

    const { canPlayCard, playCard } = this.api.service<CardEffectService>(Service.CardEffect);

    console.log('is players turn', this.isPlayersTurn(id));
    console.log('playerTurnPosition', this.playerTurnPosition);
    if (!this.isPlayersTurn(id)) return;

    canPlayCard(cardToPlay)
      .then(() => {
        playCard(player, cardIndex);
      })
      .catch(e => {
        console.log('Player could not play card', cardToPlay, e);
      });
  }

  async PicksUpCard(id: userId): Promise<void> {
    if (!this.isPlayersTurn(id)) return;

    const { pickupCard } = this.api.service<CardEffectService>(Service.CardEffect);

    const player = this.players.find(player => player.id === id);

    pickupCard(player);
  }

  async addPlayer(id: string, socket: any): Promise<string> {
    const newPlayer: Player = {
      id,
      cards: getInitialHand(false),
      hasExitedGame: false,
      position: this.getFreeTablePosition(),
    };

    this.playerSockets[id] = socket;

    const opponents: Opponent[] = this.players.filter(player => player.id !== id).map(player => toOpponent(player));

    this.players.push(newPlayer);
    console.log(`Added player for client with id: ${id} (table position: ${newPlayer.position})`);

    const cardsInPile = this.api.service<CardPileService>(Service.CardPile).cardsInPile;

    const initPlayerData: InitPlayerDataContent = {
      newPlayer,
      opponents,
      playerTurnPosition: this.playerTurnPosition,
      cardsInPile,
    };

    console.log('this.playerTurnPosition', this.playerTurnPosition);

    this.api.sendToSocket({ name: ServerEvent.InitPlayer, value: initPlayerData }, socket);
    this.api.sendToOtherSockets({ name: ServerEvent.AddOpponent, value: { opponent: toOpponent(newPlayer) } }, socket);
    return id;
  }

  getNextPlayer(): Player {
    const nextPlayerPos = this.getNextPlayerPos(this.playerTurnPosition);
    return this.players.find(player => player.position === nextPlayerPos);
  }

  getSocketForPlayer(player: Player): any {
    return this.playerSockets[player.id];
  }

  updatePlayer(player: Player): void {
    const index = this.players.findIndex(({ id }) => id === player.id);
    this.players[index] = player;
  }

  setNextPlayersTurn(): void {
    this.playerTurnPosition = this.getNextPlayerPos(this.playerTurnPosition);
    this.api.sendToAllSockets({ name: ServerEvent.SetPlayerTurn, value: { position: this.playerTurnPosition } });

    const { areAnyEffectsInStack, runFirstEffect } = this.api.service<CardEffectService>(Service.CardEffect);

    const player = this.players.find(player => player.position === this.playerTurnPosition);

    if (areAnyEffectsInStack()) {
      runFirstEffect(player, 'onNextPlayerTurn');
    } else {
      console.log('No card effects found in stack');
    }
  }

  async removePlayer(id: string): Promise<string> {
    const playerToRemove = this.players.find(player => player.id == id);

    if (playerToRemove.position === this.playerTurnPosition) this.setNextPlayersTurn();

    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    this.api.sendToAllSockets({ name: ServerEvent.RemoveOpponent, value: { id } });

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

  private isPlayersTurn(id: userId): boolean {
    return this.players.find(player => player.id === id).position === this.playerTurnPosition;
  }

  private getNextPlayerPos = (currentPos: number): number => {
    let smallestPosFound: number, nextHigherPos: number;
    for (let i = 0; i < this.players.length; i++) {
      const pos = this.players[i].position;

      if (!smallestPosFound || pos < smallestPosFound) smallestPosFound = pos;
      if (!nextHigherPos && pos > currentPos) {
        nextHigherPos = pos;
        break;
      }
    }
    return nextHigherPos || smallestPosFound;
  };
}
