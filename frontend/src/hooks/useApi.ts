import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.current?.on(event, (value: any) => {
        dispatch({
          name: event,
          value,
        });
      });
    });
  }, [dispatch]);

  return socket.current as Socket;
};

export default useApi;
