import { ApiServer } from './src/ApiServer';
import addEventListeners from './src/eventListeners';

const api = new ApiServer();
addEventListeners(api);
