import feathers from '@feathersjs/feathers';
import '@feathersjs/transport-commons';
import express, { Application } from '@feathersjs/express';
import channels from './src/channels';
import services, { AppServices } from './src/services';
import setupServer from './src/setupServer';
import eventListeners from './src/eventListeners';

// Creates an ExpressJS compatible Feathers application
export type Api = Application<AppServices>;
const app: Api = express(feathers());

app.configure(setupServer);
app.configure(services);
app.configure(channels);
app.configure(eventListeners);

// Start the server
app.listen(3030).on('listening', () => console.log('Feathers server listening on localhost:3030'));
