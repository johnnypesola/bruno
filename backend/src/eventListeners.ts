import { Api } from '../Api';
import { Channels } from './channels';
import { getUserId } from '../utils';
import { Service } from '../../src/types/services';

export default (app: Api): void => {
  // Add any new real-time connection to the `everybody` channel
  app.on('connection', connection => {
    app.channel(Channels.CardPile).join(connection);

    const userId = getUserId(connection);
    app.channel(userId).join(connection);

    app.service(Service.Player).addPlayer(userId);
  });

  app.on('disconnect', connection => {
    const userId = getUserId(connection);
    console.log(`user ${userId} disconnected`);

    app.service(Service.Player).removePlayer(userId);
  });
};
