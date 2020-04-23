import { Player, CardValue } from '../../src/types/commonTypes';
import { ApiServer } from './ApiServer';
import { PlayerService } from './services/Player';
import { ServiceName } from '../../src/types/services';
import { getRandomCard, toOpponent } from '../utils';
import { ServerEvent } from '../../src/types/serverEventTypes';

type effectFnData = { player: Player; api: ApiServer; socket: any };
type effectFn = (data: effectFnData) => void;

export type CardEffect = {
  [CardValue.PlusTwo]: effectFn;
  [CardValue.Skip]: effectFn;
};

export const cardEffects: CardEffect = {
  [CardValue.PlusTwo]: ({ api }) => {
    const nextPlayer = api.service<PlayerService>(ServiceName.Player).getNextPlayer();
    const newCards = [getRandomCard(false), getRandomCard(false)];
    nextPlayer.cards = [...nextPlayer.cards, ...newCards];

    api.service<PlayerService>(ServiceName.Player).updatePlayer(nextPlayer);

    newCards.forEach(card => {
      api.sendToPlayer({ name: ServerEvent.PlayerPickedUpCard, value: { card } }, nextPlayer);
    });

    api.sendToOtherPlayers(
      { name: ServerEvent.UpdateOpponent, value: { opponent: toOpponent(nextPlayer) } },
      nextPlayer,
    );
  },
  [CardValue.Skip]: ({ api }) => {
    api.service<PlayerService>(ServiceName.Player).setNextPlayersTurn();
  },
};
