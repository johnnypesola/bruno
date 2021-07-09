import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import useGameState from './hooks/useGameState';
import { GameState } from './types/commonTypes';
import { GameStateAction } from './types/serverEventTypes';
import TempArt from './components/zdog/TempArt';

export const GameStateContext = React.createContext(
  null as unknown as { state: GameState; dispatch: React.Dispatch<GameStateAction> },
);

const RootComponent: React.FC = () => {
  const [state, dispatch] = useGameState();

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      <TempArt />
      {/* <App /> */}
    </GameStateContext.Provider>
  );
};

ReactDOM.render(<RootComponent />, document.getElementById('root'));
