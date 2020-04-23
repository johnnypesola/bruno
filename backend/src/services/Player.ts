import { Player, InitPlayerDataContent, Opponent } from '../../../src/types/commonTypes';
import { ServerEvent } from '../../../src/types/serverEventTypes';
import { getInitialHand, getRandomCard } from '../../utils';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';
import { userId } from '../eventListeners';
import { ServiceName } from '../../../src/types/services';
import { CardPileService } from './CardPile';
import { canPlayCard, playCard, triggerCardEffect } from '../cardLogic';

export class PlayerService extends BaseService {
  players: Player[];
  playerTurnPosition: number;

  constructor(api: ApiServer) {
    super(api);
    this.players = [];
    this.playerTurnPosition = 1;
  }

  async playCard(id: userId, cardIndex: number, socket: any): Promise<void> {
    const player = this.players.find(player => player.id === id);
    const cardToPlay = player.cards[cardIndex];

    console.log('is players turn', this.isPlayersTurn(id));
    console.log('playerTurnPosition', this.playerTurnPosition);
    if (!this.isPlayersTurn(id)) return;

    canPlayCard(cardToPlay, this.api)
      .then(() => {
        const playedCard = player.cards.splice(cardIndex, 1)[0];
        triggerCardEffect(playedCard, player, this.api, socket);
        this.setNextPlayersTurn();
      })
      .catch(() => {
        console.log('Player could not play card', cardToPlay);
      });
  }

  async PicksUpCard(id: userId, socket: any): Promise<void> {
    if (!this.isPlayersTurn(id)) return;

    const card = getRandomCard(false);
    const player = this.players.find(player => player.id === id);
    player.cards.push(card);

    this.api.typedEmit({ name: ServerEvent.PlayerPickedUpCard, value: { card } }, socket);

    const opponent: Opponent = {
      ...player,
      cards: player.cards.map(() => null),
    };

    this.api.typedBroadcastEmit({ name: ServerEvent.UpdateOpponent, value: { opponent } }, socket);

    this.setNextPlayersTurn();
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

    const initPlayerData: InitPlayerDataContent = {
      newPlayer,
      opponents,
      playerTurnPosition: this.playerTurnPosition,
      cardsInPile,
    };

    console.log('this.playerTurnPosition', this.playerTurnPosition);

    this.api.typedEmit({ name: ServerEvent.InitPlayer, value: initPlayerData }, socket);
    this.api.typedBroadcastEmit({ name: ServerEvent.AddOpponent, value: { opponent: newPlayerAsOpponent } }, socket);
    return id;
  }

  getNextPlayer(): Player {
    const nextPlayerPos = this.getNextPlayerPos(this.playerTurnPosition);

    return this.players.find(player => player.position === nextPlayerPos);
  }

  async removePlayer(id: string): Promise<string> {
    const playerToRemove = this.players.find(player => player.id == id);

    if (playerToRemove.position === this.playerTurnPosition) this.setNextPlayersTurn();

    this.players = this.players.filter(player => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    this.api.typedEmit({ name: ServerEvent.RemoveOpponent, value: { id } });

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

  private setNextPlayersTurn(): void {
    this.playerTurnPosition = this.getNextPlayerPos(this.playerTurnPosition);

    this.api.typedEmit({ name: ServerEvent.SetPlayerTurn, value: { position: this.playerTurnPosition } });
  }
}
