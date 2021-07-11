import { useEffect, useRef, useContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { GameStateContext } from '..';
import { GameStateAction, ServerEvent } from '../types/serverEventTypes';
import { enumAsValues } from '../utils';

const useApi = (dispatch: React.Dispatch<GameStateAction>): Socket => {
  const socket = useRef<Socket>();

  useEffect(() => {
    if (socket.current) return;
    const params = new URLSearchParams(window.location.search);
    const server = params.get('server') || 'http://localhost:8080';
    socket.current = io(server);

    // Receive real-time events through Socket.io
    // and dispatch them directly into game state reducer.
    enumAsValues(ServerEvent).forEach((event) => {
      socket.current?.on(event, (value: any) => {
        dispatch({
          name: event,
          value,
        });
      });
    });
  }, []);

  return socket.current as Socket;
};

export default useApi;
