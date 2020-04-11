import { Service } from '../../src/types/services';
import { getOtherPlayersChannels } from '../utils';
import { Opponent, TablePosition } from '../../src/types/commonTypes';
import { Api } from '../Api';
import { Channel } from '@feathersjs/transport-commons/lib/channels/channel/base.d.ts';
import { PlayerEvent } from '../../src/types/events';

export enum Channels {
  CardPile = 'cardpile',
}

export default (app: Api): void => {
  app.service(Service.Player).publish(
    PlayerEvent.PlayerAdded,
    (userId, context): Channel => {
      const newPlayer: Opponent = {
        id: userId,
        cards: [null, null, null, null, null, null, null],
        position: TablePosition.OpponentLeft,
        hasExitedGame: false,
      };

      const otherPlayersChannels = getOtherPlayersChannels(app, userId);
      return otherPlayersChannels.send(newPlayer);
    },
  );

  app.service(Service.Player).publish(
    PlayerEvent.PlayerRemoved,
    (userId, context): Channel => {
      console.log('pulish for playerRemoved');
      const otherPlayersChannels = getOtherPlayersChannels(app, userId);
      return otherPlayersChannels.send(userId);
    },
  );
};
