import { Player } from '../../../frontend/src/types/commonTypes';
import { ServerEvent } from '../../../frontend/src/types/serverEventTypes';
import { ApiServer } from '../ApiServer';
import { BaseService } from './Base';

export class GameService extends BaseService {
  isGameOver: boolean;
  winningPlayer?: Player;

  constructor(api: ApiServer) {
    super(api);
    this.isGameOver = false;
  }

  endGameWithWinningPlayer = (player: Player): void => {
    this.isGameOver = true;
    this.winningPlayer = player;
    this.restartGame();
  };

  private restartGame = (): void => {
    // Do countdown
    console.log('Restarting game');
    let elapsedSeconds = 0;
    const maxSeconds = 10;
    const interval = setInterval(() => {
      if (elapsedSeconds === maxSeconds) {
        this.isGameOver = false;
        this.winningPlayer = undefined;
        this.api.services.CardPile.resetCardPile();
        this.api.services.Player.resetPlayers();

        clearInterval(interval);
        console.log('Game is now restarted');
      } else {
        const secondsToRestart = maxSeconds - elapsedSeconds;
        this.api.sendToAllSockets({ name: ServerEvent.GameRestarsInSeconds, value: { seconds: secondsToRestart } });
        console.log('Seconds to restart:', secondsToRestart);
      }
      elapsedSeconds++;
    }, 1000);
    return;
  };
}
