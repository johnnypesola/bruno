import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import { Api } from '../Api';

export default (app: Api): Api => {
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

  // Express middleware with a nicer error handler
  app.use(express.errorHandler());

  return app;
};
