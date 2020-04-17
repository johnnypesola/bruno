import { useEffect, useRef, useContext } from 'react';
import { ServiceName } from '../types/services';
import { PlayerEvent, OpponentEvent, CardPileEvent } from '../types/events';
import io from 'socket.io-client';
import { GameStateContext } from '..';
import { Opponent, InitPlayerData, CardInHand, CardInPile } from '../types/commonTypes';
import { Action } from '../types/gameStateActionTypes';

const useApi = (): SocketIOClient.Socket => {
  const socket = useRef<SocketIOClient.Socket>();
  const { state, dispatch } = useContext(GameStateContext);

  useEffect(() => {
    socket.current = io('http://localhost:8080');

    // Receive real-time events through Socket.io
    socket.current.on(PlayerEvent.PlayedCard, (newCards: CardInHand[]) => {
      dispatch({
        name: Action.PlayerPlaysCard,
        value: { newCards },
      });
    });
    socket.current.on(PlayerEvent.PlayerInit, (initData: InitPlayerData) => {
      dispatch({
        name: Action.InitPlayer,
        value: { player: initData.newPlayer },
      });
      dispatch({
        name: Action.AddOpponents,
        value: { opponents: initData.opponents },
      });
      dispatch({
        name: Action.SetPlayerTurn,
        value: { position: initData.playerTurnPosition },
      });
      dispatch({
        name: Action.UpdateCardPile,
        value: { cards: initData.cardsInPile },
      });

      console.log('initData.playerTurnPosition', initData.playerTurnPosition);
    });

    socket.current.on(OpponentEvent.OpponentAdded, (opponent: Opponent) => {
      console.log(opponent);
      dispatch({
        name: Action.AddOpponent,
        value: { opponent },
      });
    });

    socket.current.on(OpponentEvent.OpponentRemoved, (id: string) => {
      dispatch({
        name: Action.RemoveOpponent,
        value: { id },
      });
      console.log('Opponent Removed', id);
    });

    socket.current.on(OpponentEvent.OpponentUpdate, (opponent: Opponent) => {
      dispatch({
        name: Action.UpdateOpponent,
        value: { opponent },
      });
      console.log('Opponent Updated', opponent.id);
    });

    socket.current.on(PlayerEvent.NextPlayerTurn, (position: number) => {
      dispatch({
        name: Action.SetPlayerTurn,
        value: { position },
      });
      console.log('Next player turn', position);
    });

    socket.current.on(CardPileEvent.CardAddedToPile, (card: CardInPile) => {
      console.log('Card added to pile', card);
      console.log('CardPile in state', state.cardPile);

      dispatch({
        name: Action.AddCardToPile,
        value: { card },
      });
    });

    // getPlayers(app);
  }, []);

  // const getPlayers = (app: Application<any>): void => {
  //   app
  //     .service(Service.Player)
  //     .find()
  //     .then((response: string) => console.log('GET PLAYERS:', response));
  // };

  return socket.current as SocketIOClient.Socket;
};

export default useApi;
