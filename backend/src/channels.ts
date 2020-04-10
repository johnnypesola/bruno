import { Service } from './services';
import { getOtherPlayersChannels } from '../utils';
import { Opponent, TablePosition } from '../../src/types/commonTypes';
import { Api } from '../Api';

export enum Channels {
  CardPile = 'cardpile',
}

export default (app: Api): void => {
  app.service(Service.Player).publish('playerAdded', (userId, context) => {
    const otherPlayersChannels = getOtherPlayersChannels(app, userId);

    const newPlayer: Opponent = {
      id: userId,
      cards: [null, null, null, null, null, null, null],
      position: TablePosition.OpponentLeft,
      hasExitedGame: false,
    };

    return otherPlayersChannels.send(newPlayer);
  });
};
