import { Player, InitPlayerDataContent, Opponent } from '../../../frontend/src/types/commonTypes';
import { ServerEvent } from '../../../frontend/src/types/serverEventTypes';
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
    const { gameStage } = this.api.services.Game;
    if (gameStage !== "started" || !this.isPlayersTurn(id)) return;

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
    const { gameStage } = this.api.services.Game;
    const { canPlaySelectedCards, playSelectedCards } = this.api.services.CardEffect;
    if (gameStage !== "started" || !this.isPlayersTurn(id) || !canPlaySelectedCards) return;

    const player = this.players.find((player) => player.id === id);
    if (!player) return;

    playSelectedCards(player);
    this.handleLastCardPlayed(player);
  }

  playCard(id: userId, cardIndex: number): void {
    const { gameStage } = this.api.services.Game;
    if (gameStage !== "started" || !this.isPlayersTurn(id)) return;

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
    const { gameStage } = this.api.services.Game;
    if (gameStage !== "started" || !this.isPlayersTurn(id)) return;

    const { pickupCard } = this.api.services.CardEffect;

    const player = this.players.find((player) => player.id === id);
    if (!player) return;

    pickupCard(player);
  }

  selectCharacter(id: userId, characterId: number): void {
    const { gameStage } = this.api.services.Game;
    if (gameStage !== "characterSelection") return;

    const player = this.players.find((player) => player.id === id);
    const isCharacterTaken = this.players.some(player => player.characterId === characterId);
    if(!player || isCharacterTaken) return;
    player.characterId = characterId;

    this.handleLastPlayerSelectsCharacter();
  }

  addPlayer(id: string, socket: Socket): string {
    const newPlayer: Player = {
      id,
      cards: [],
      hasExitedGame: false,
      // position: this.getFreeTablePosition(),
      position: undefined,
      isInitialized: false,
    };

    this.playerSockets[id] = socket;

    this.players.push(newPlayer);
    console.log(`Added player for client with id: ${id} (table position: ${newPlayer.position})`);

    this.initPlayer(newPlayer);
    return id;
  }

  clearPlayers(): void {
    this.players.forEach((player) => {
      player.cards = [];
      player.characterId = undefined;
    });
  }

  initPlayers(): void {
    this.players.forEach((player) => {
      this.initPlayer(player);
    });
  }

  private initPlayer = (player: Player): void => {
    const opponents: Opponent[] = this.players.filter(({ id }) => player.id !== id).map((player) => toOpponent(player));
    const { cardsInPile } = this.api.services.CardPile;
    const { gameStage } = this.api.services.Game;

    const initPlayerData: InitPlayerDataContent = {
      newPlayer: player,
      opponents,
      playerTurnPosition: this.playerTurnPosition,
      cardsInPile,
      gameStage
    };

    console.log('this.playerTurnPosition', this.playerTurnPosition);
    console.log('gameStage', gameStage);

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

  dealCardsToPlayers(): void {
    this.players.forEach((player) => {
      if(player.position) player.cards = getInitialHand(false);
    })
  };

  givePlayersTablePositions(): void {
    this.players.forEach((player) => {
      if(player.characterId) player.position = this.getFreeTablePosition();
    })
  }

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

  removePlayer(id: string): void {
    const playerToRemove = this.players.find((player) => player.id == id);

    if (playerToRemove?.position === this.playerTurnPosition) this.setNextPlayersTurn();

    this.players = this.players.filter((player) => player.id !== id);
    console.log(`Removed player for client with id: ${id}`);

    this.api.sendToAllSockets({ name: ServerEvent.RemoveOpponent, value: { id } });

    const { gameStage, initEndGame } = this.api.services.Game;
    if(gameStage === "started" && !this.players.some(player => player.position)) {
      initEndGame();
    }
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
    let firstPlayerPos: number | undefined;
    let nextPlayerPos = 0;
    const { isReversePlay } = this.api.services.CardEffect;

    if(isReversePlay) {
      for (let i = this.players.length - 1; i >= 0; i--) {
        const playerPos = this.players[i].position;

        if(playerPos) {
          if (!firstPlayerPos || playerPos > firstPlayerPos) firstPlayerPos = playerPos;
          if (playerPos < currentPos) nextPlayerPos = playerPos;
        } 
        if(nextPlayerPos) break;
      }
    } else {
      for (let i = 0; i < this.players.length; i++) {
        const playerPos = this.players[i].position;

        if(playerPos) {
          if (!firstPlayerPos || playerPos < firstPlayerPos) firstPlayerPos = playerPos;
          if (playerPos > currentPos) nextPlayerPos = playerPos;
        }

        if(nextPlayerPos) break;
      }
    }
    
    return nextPlayerPos || firstPlayerPos || 0;
  };

  private handleLastPlayerSelectsCharacter(): void {
    const isSomePlayerWithoutCharacter = this.players.some(player => !player.characterId);
    if(isSomePlayerWithoutCharacter) return;

    this.api.services.Game.initStartGame();
  }

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
