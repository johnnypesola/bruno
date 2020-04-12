import { useEffect, useRef, useContext } from 'react';
import { Service } from '../types/services';
import { PlayerEvent } from '../types/events';
import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import { GameStateContext } from '..';
import { Opponent } from '../types/commonTypes';
import { Action } from '../types/gameStateActionTypes';
import { Application } from '@feathersjs/feathers';

const useApi = (): Application<any> => {
  const feathersApp = useRef(feathers());
  const { dispatch } = useContext(GameStateContext);

  useEffect(() => {
    const socket = io('http://localhost:3030');
    const app = feathers();
    app.configure(feathers.socketio(socket));
    app.configure(feathers.authentication());

    // Receive real-time events through Socket.io
    app.service(Service.Player).on(PlayerEvent.PlayerInit, (opponents: Opponent[]) => {
      dispatch({
        name: Action.AddOpponents,
        value: { opponents },
      });
    });

    app.service(Service.Player).on(PlayerEvent.PlayerAdded, (opponent: Opponent) => {
      console.log(opponent);
      dispatch({
        name: Action.AddOpponent,
        value: { opponent },
      });
    });

    app.service(Service.Player).on(PlayerEvent.PlayerRemoved, (id: string) => {
      dispatch({
        name: Action.RemoveOpponent,
        value: { id },
      });
      console.log('PlayerRemoved', id);
    });

    // getPlayers(app);

    feathersApp.current = app;
  }, []);

  // const getPlayers = (app: Application<any>): void => {
  //   app
  //     .service(Service.Player)
  //     .find()
  //     .then((response: string) => console.log('GET PLAYERS:', response));
  // };

  return feathersApp.current;
};

export default useApi;
