import feathers from '@feathersjs/feathers';
import '@feathersjs/transport-commons';
import express from '@feathersjs/express';
import { getUserId, getInitialHand, getOtherPlayersChannels } from './utils';
import { Channels, addChannelPublishers } from './src/channels';
import { setupServer } from './src/setupServer';
import { ApiService } from './src/services';
import { Opponent, TablePosition } from '../frontend/src/types/commonTypes';

// Creates an ExpressJS compatible Feathers application
const app = setupServer(express(feathers()));

// Publish all events to the `everybody` channel
// app.publish(data => app.channel('everybody'));

// Add any new real-time connection to the `everybody` channel
app.on('connection', connection => {
  app.channel(Channels.CardPile).join(connection);

  const userId = getUserId(connection);
  app.channel(userId).join(connection);

  app.service(ApiService.Player).addPlayer(userId);
});

app.on('disconnect', (connection) => {
  const userId = getUserId(connection);
  console.log(`user ${userId} disconnected`);

  app.service(ApiService.Player).removePlayer(userId);
});

// Start the server
app.listen(3030).on('listening', () =>
  console.log('Feathers server listening on localhost:3030')
);

