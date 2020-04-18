import { ApiServer } from '../ApiServer';
import { ServerEvent, GameStateAction } from '../../../src/types/serverEventTypes';

export class BaseService {
  constructor(protected api: ApiServer) {}
}
