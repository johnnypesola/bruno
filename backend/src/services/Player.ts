import { Player, InitPlayerDataContent, Opponent } from '../../../src/types/commonTypes';
import { ServerEvent } from '../../../src/types/serverEventTypes';
import { getInitialHand, toOpponent } from '../../utils';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';
import { userId } from '../eventListeners';
import { Socket } from 'socket.io';

export class PlayerService extends BaseService {
  players: Player[];
  playerSockets: { [key: string]: Socket };
  playerTurnPosition: number;

  constructor(api: ApiServer) {
    super(api);
    this.players = [];
    this.playerSockets = {};
    this.playerTurnPosition = 1;
  }

  selectCard(id: userId, cardIndex: number, isSelected: boolean): void {
    const { isGameOver } = this.api.services.Game;
    if (isGameOver || !this.isPlayersTurn(id)) return;

    const player = this.players.find((player) => player.id === id);
    if (!player) return;

    const cardToSelect = player.cards[cardIndex];

    const { canSelectCard, selectCard } = this.api.services.CardEffect;

    canSelectCard(player, cardIndex, isSelected)
      .then(() => {
        console.log('Player selects card', cardToSelect);
        selectCard(player, cardIndex, isSelected);
      })
      .catch((e) => {
        console.log('Player could not select card', cardToSelect, e);
      });
  }

  playSelectedCards(id: userId): void {
    const { isGameOver } = this.api.services.Game;
    const { canPlaySelectedCards, playSelectedCards } = this.api.services.CardEffect;
    if (isGameOver || !this.isPlayersTurn(id) || !canPlaySelectedCards) return;

    const player = this.players.find((player) => player.id === id);
    if (!player) return;

    playSelectedCards(player);
    this.handleLastCardPlayed(player);
  }

  playCard(id: userId, cardIndex: number): void {
    const { isGameOver } = this.api.services.Game;
    if (isGameOver || !this.isPlayersTurn(id)) return;

    const player = this.players.find((player) => player.id === id);
    if (!player) return;
    const cardToPlay = player.cards[cardIndex];

    const { canPlayCard, playCards } = this.api.services.CardEffect;

    canPlayCard(cardToPlay)
      .then(() => {
        playCards(player, [cardIndex]);
        this.handleLastCardPlayed(player);
      })
      .catch((e) => {
        console.log('Player could not play card', cardToPlay, e);
      });
  }

  picksUpCard(id: userId): void {
    const { isGameOver } = this.api.services.Game;
    if (isGameOver || !this.isPlayersTurn(id)) return;

    const { pickupCard } = this.api.services.CardEffect;

    const player = this.players.find((player) => player.id === id);
    if (!player) return;

    pickupCard(player);
  }

  addPlayer(id: string, socket: Socket): string {
    const newPlayer: Player = {
      id,
      cards: getInitialHand(false),
      hasExitedGame: false,
      position: this.getFreeTablePosition(),
      isInitialized: false,
    };

    this.playerSockets[id] = socket;

    this.players.push(newPlayer);
    console.log(`Added player for client with id: ${id} (table position: ${newPlayer.position})`);

    this.initPlayer(newPlayer);
    return id;
  }

  resetPlayers = (): void =>
    this.players.forEach((player) => {
      player.cards = getInitialHand(false);
      this.initPlayer(player);
    });

  private initPlayer = (player: Player): void => {
    const opponents: Opponent[] = this.players.filter(({ id }) => player.id !== id).map((player) => toOpponent(player));
    const { cardsInPile } = this.api.services.CardPile;

    const initPlayerData: InitPlayerDataContent = {
      newPlayer: player,
      opponents,
      playerTurnPosition: this.playerTurnPosition,
      cardsInPile,
    };

    console.log('this.playerTurnPosition', this.playerTurnPosition);

    const socket = this.getSocketForPlayer(player);

    this.api.sendToSocket({ name: ServerEvent.InitPlayer, value: initPlayerData }, socket);
    this.api.sendToOtherSockets(
      {
        name: player.isInitialized ? ServerEvent.UpdateOpponent : ServerEvent.AddOpponent,
        value: { opponent: toOpponent(player) },
      },
      socket,
    );
    player.isInitialized = true;
  };

  getNextPlayer(): Player {
    const nextPlayerPos = this.getNextPlayerPos(this.playerTurnPosition);
    return this.players.find((player) => player.position === nextPlayerPos) as Player;
  }

  getSocketForPlayer(player: Player): Socket {
    return this.playerSockets[player.id];
  }

  updatePlayer(player: Player): void {
    const index = this.players.findIndex(({ id }) => id === player.id);
    this.players[index] = player;
  }

  setNextPlayersTurn(): void {
    this.playerTurnPosition = this.getNextPlayerPos(this.playerTurnPosition);
    this.api.sendToAllSockets({ name: ServerEvent.SetPlayerTurn, value: { position: this.playerTurnPosition } });

    const { areAnyEffectsInStack, runAllCardEffects } = this.api.services.CardEffect;

    const player = this.players.find((player) => player.position === this.playerTurnPosition);

    if (areAnyEffectsInStack() && player) {
      runAllCardEffects(player, 'onNextPlayerTurn');
    } else {
      console.log('No card effects found in stack');
    }
  }

  removePlayer(id: string): string {
    const playerToRemove = this.players.find((player) => player.id == id);

    if (playerToRemove?.position === this.playerTurnPosition) this.setNextPlayersTurn();

    this.players = this.players.filter((player) => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    this.api.sendToAllSockets({ name: ServerEvent.RemoveOpponent, value: { id } });

    return id;
  }

  private getFreeTablePosition = (): number => {
    let freePos = 1;
    const takenPositions = this.players.map((player) => player.position).sort();
    takenPositions.every((pos) => {
      if (freePos === pos) {
        freePos = pos + 1;
        return true;
      }
    });
    return freePos;
  };

  private isPlayersTurn(id: userId): boolean {
    return this.players.find((player) => player.id === id)?.position === this.playerTurnPosition;
  }

  private getNextPlayerPos = (currentPos: number): number => {
    let smallestPosFound = 0;
    let nextHigherPos = 0;
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

  private async handleLastCardPlayed(player: Player): Promise<void> {
    const hasCardsLeft = player.cards.length > 0;
    if (hasCardsLeft) return;

    const topCardEffect = await this.api.services.CardEffect.getTopCardEffect();
    if (topCardEffect) {
      console.log('Player played effect card as last card. Player picks up at least two cards');
      this.api.services.CardEffect.cardsToPickup += 2;
      const { pickupCard } = this.api.services.CardEffect;
      pickupCard(player);
    }
    if (!topCardEffect) {
      console.log('Player wins');

      const { endGameWithWinningPlayer } = this.api.services.Game;
      endGameWithWinningPlayer(player);

      const socket = this.getSocketForPlayer(player);
      this.api.sendToSocket({ name: ServerEvent.PlayerWins, value: {} }, socket);
      this.api.sendToOtherSockets({ name: ServerEvent.OpponentWins, value: { opponent: toOpponent(player) } }, socket);
    }
  }
}
