import { Player } from "../../../src/types/commonTypes";
import { ServerEvent } from "../../../src/types/serverEventTypes";
import { Service } from "../../../src/types/services";
import { ApiServer } from "../ApiServer";
import { BaseService } from "./Base";
import { CardPileService } from "./CardPile";

export class GameService extends BaseService {
    isGameOver: boolean
    winningPlayer?: Player;

    constructor(api: ApiServer) {
      super(api);
      this.isGameOver = false;
    }

    endGameWithWinningPlayer = (player: Player) => {
        this.isGameOver = true;
        this.winningPlayer = player;
        this.restartGame();
    }

    private restartGame = (): Promise<void> => {
        // Do countdown
        console.log("Restarting game")
        let elapsedSeconds = 0;
        const maxSeconds = 10;
        const interval = setInterval(() => {
            if (elapsedSeconds === maxSeconds) {
                this.isGameOver = false;
                this.winningPlayer = undefined;
                clearInterval(interval);
                console.log("Game is now restarted")

            } else {
                const secondsToRestart = maxSeconds - elapsedSeconds;
                this.api.sendToAllSockets({ name: ServerEvent.GameRestarsInSeconds, value: { seconds: secondsToRestart } });
                console.log("Seconds to restart:", secondsToRestart);
            }
            elapsedSeconds++;
        }, 1000)
        return;
    }
}