import { useEffect, useRef, useContext } from 'react';
import { ServiceName } from '../types/services';
import { PlayerEvent, OpponentEvent } from '../types/events';
import io from 'socket.io-client';
import { GameStateContext } from '..';
import { Opponent, InitPlayerData } from '../types/commonTypes';
import { Action } from '../types/gameStateActionTypes';

const useApi = (): SocketIOClient.Socket => {
  const socket = useRef<SocketIOClient.Socket>();
  const { dispatch } = useContext(GameStateContext);

  useEffect(() => {
    socket.current = io('http://localhost:8080');

    // Receive real-time events through Socket.io
    socket.current.on(PlayerEvent.PlayerInit, (initData: InitPlayerData) => {
      dispatch({
        name: Action.AddOpponents,
        value: { opponents: initData.opponents },
      });
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
        name: Action.SetNextPlayerTurn,
        value: { position },
      });
      console.log('Next player turn', position);
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
