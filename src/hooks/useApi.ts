import { useEffect, useRef, useContext } from 'react';
import { ServiceName } from '../types/services';
import { PlayerEvent } from '../types/events';
import io from 'socket.io-client';
import { GameStateContext } from '..';
import { Opponent } from '../types/commonTypes';
import { Action } from '../types/gameStateActionTypes';

const useApi = (): SocketIOClient.Socket => {
  const socket = useRef(io('http://localhost:8080'));
  const { dispatch } = useContext(GameStateContext);

  useEffect(() => {
    // Receive real-time events through Socket.io
    socket.current.on(PlayerEvent.PlayerInit, (opponents: Opponent[]) => {
      dispatch({
        name: Action.AddOpponents,
        value: { opponents },
      });
    });

    socket.current.on(PlayerEvent.PlayerAdded, (opponent: Opponent) => {
      console.log(opponent);
      dispatch({
        name: Action.AddOpponent,
        value: { opponent },
      });
    });

    socket.current.on(PlayerEvent.PlayerRemoved, (id: string) => {
      dispatch({
        name: Action.RemoveOpponent,
        value: { id },
      });
      console.log('PlayerRemoved', id);
    });

    // getPlayers(app);
  }, []);

  // const getPlayers = (app: Application<any>): void => {
  //   app
  //     .service(Service.Player)
  //     .find()
  //     .then((response: string) => console.log('GET PLAYERS:', response));
  // };

  return socket.current;
};

export default useApi;
