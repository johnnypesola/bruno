
import { toOpponent } from '../../utils';
import { GameStage, Player } from '../../../frontend/src/types/commonTypes';
import { ServerEvent } from '../../../frontend/src/types/serverEventTypes';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';

export class GameService extends BaseService {
  gameStage: GameStage;
  winningPlayer?: Player;

  constructor(api: ApiServer) {
    super(api);
    this.gameStage = "characterSelection";
  }

  endGameWithWinningPlayer = (player: Player): void => {
    const socket = this.api.services.Player.getSocketForPlayer(player);
    this.api.sendToSocket({ name: ServerEvent.PlayerWins, value: {} }, socket);
    this.api.sendToOtherSockets({ name: ServerEvent.OpponentWins, value: { opponent: toOpponent(player) } }, socket);

    setTimeout(() => {
      this.initEndGame();
    }, 3000);
  };

  initStartGame = (): void => {
    console.log("Starting game");

    const progressCallback = (secondsLeft: number) => {
      this.api.sendToAllSockets({ name: ServerEvent.GameStartsInSeconds, value: { seconds: secondsLeft } });
      console.log('Seconds to start:', secondsLeft);
    };

    const endCallback = () => {
      this.changeGameStage("started");
      this.winningPlayer = undefined;
      this.api.services.CardPile.initCardPile();
      this.api.services.Player.givePlayersTablePositions();
      this.api.services.Player.dealCardsToPlayers();
      this.api.services.Player.setNextPlayersTurn();
      this.api.services.Player.initPlayers();

      console.log('Game has started');
    };

    this.initCountdown({ progressCallback, endCallback });
  }

  initEndGame = (): void => {
    console.log('Ending game');
    this.changeGameStage("ended");
    const progressCallback = (secondsLeft: number) => {
      this.api.sendToAllSockets({ name: ServerEvent.GameEndsInSeconds, value: { seconds: secondsLeft } });
      console.log('Seconds to end:', secondsLeft);
    };

    const endCallback = () => {
      this.winningPlayer = undefined;
      this.api.services.CardPile.clearCardPile();
      this.api.services.Player.clearPlayers();
      this.api.services.Player.initPlayers();
      this.changeGameStage("characterSelection");
      console.log('Game has ended');
    };

    this.initCountdown({ progressCallback, endCallback });
  };

  private changeGameStage(newGameStage: GameStage) {
    this.gameStage = newGameStage;
    this.api.sendToAllSockets({ name: ServerEvent.GameStageChange, value: { gameStage: this.gameStage } });
  }

  private initCountdown(callbacks: {
      progressCallback: (secondsLeft: number) => void,
      endCallback: () => void
    }): void {

   // Do countdown
   let elapsedSeconds = 0;
   const maxSeconds = 10;
   const interval = setInterval(() => {
     if (elapsedSeconds === maxSeconds) {
      callbacks.endCallback();
      clearInterval(interval);
     } else {
      const secondsLeft = maxSeconds - elapsedSeconds;
      callbacks.progressCallback(secondsLeft);
     }
     elapsedSeconds++;
   }, 1000);
   return;
  }
}
