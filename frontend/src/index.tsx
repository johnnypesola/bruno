import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import useGameState from './hooks/useGameState';
import { GameState } from './types/commonTypes';
import { GameStateAction } from './types/serverEventTypes';
import GfxRoot from './components/zdog/GfxRoot';
import { Socket } from 'socket.io-client';
import useApi from './hooks/useApi';
import styled from 'styled-components';

type GameStateContextProps = { state: GameState; dispatch: React.Dispatch<GameStateAction>; socket: Socket };

export const GameStateContext = React.createContext(null as unknown as GameStateContextProps);

const RootComponent: React.FC = () => {
  const [state, dispatch] = useGameState();
  const socket = useApi(dispatch);

  const ErrorText = styled.h1`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    text-align: center;
  `;

  return (
    <GameStateContext.Provider value={{ state, dispatch, socket }}>
      <GfxRoot />
      {socket && <App />}
      {!socket && <ErrorText>Could not connect to server</ErrorText>}
    </GameStateContext.Provider>
  );
};

ReactDOM.render(<RootComponent />, document.getElementById('root'));
