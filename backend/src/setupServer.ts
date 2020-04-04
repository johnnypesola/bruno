import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import { CardPileService, PlayerService, ApiService } from './services';
import { addChannelPublishers } from './channels';

export const setupServer = (app: express.Application<any>): express.Application<any> => {
  // Express middleware to parse HTTP JSON bodies
  app.use(express.json());
  // Express middleware to parse URL-encoded params
  app.use(express.urlencoded({ extended: true }));
  // Express middleware to to host static files from the current folder
  app.use(express.static(__dirname));
  // Add REST API support
  app.configure(express.rest());
  // Configure Socket.io real-time APIs
  app.configure(socketio());

  // Register our services
  app.use(ApiService.CardPile, new CardPileService());
  app.use(ApiService.Player, new PlayerService());

  addChannelPublishers(app);

  // Express middleware with a nicer error handler
  app.use(express.errorHandler());

  return app;
};