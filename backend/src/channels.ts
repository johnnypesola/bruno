import { ApiService } from "./services";
import { getOtherPlayersChannels } from "../utils";
import { Opponent, TablePosition } from "../../frontend/src/types/commonTypes";

export enum Channels {
  CardPile = "cardpile"
}

export const addChannelPublishers = (app) => {
 
  app.service(ApiService.Player).publish("playerAdded", (userId, context) => {

    const otherPlayersChannels = getOtherPlayersChannels(app, userId);
  
    const newPlayer: Opponent = {
      id: userId,
      cards: [null, null, null, null, null, null, null],
      position: TablePosition.OpponentLeft,
      hasExitedGame: false
    }
  
    return otherPlayersChannels.send(
      newPlayer
    );
  });
}
