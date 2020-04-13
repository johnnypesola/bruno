import { ApiServer } from './src/ApiServer';
import addServices from './src/services';
import addEventListeners from './src/eventListeners';

const api = new ApiServer();

addServices(api);
addEventListeners(api);
