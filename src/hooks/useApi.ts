import { useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { GameStateContext } from '..';
import { ServerEvent } from '../types/serverEventTypes';
import { enumAsValues } from '../utils';

const useApi = (): SocketIOClient.Socket => {
  const socket = useRef<SocketIOClient.Socket>();
  const { dispatch } = useContext(GameStateContext);

  useEffect(() => {
    socket.current = io('http://localhost:8080');

    // Receive real-time events through Socket.io
    // and dispatch them directly into game state reducer.
    enumAsValues(ServerEvent).forEach(event => {
      socket.current?.on(event, (value: any) => {
        dispatch({
          name: event,
          value,
        });
      });
    });
  }, []);

  return socket.current as SocketIOClient.Socket;
};

export default useApi;
