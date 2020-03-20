import React, { useContext } from 'react';
import styled from 'styled-components';
import { GameStateContext } from '..';
import { Action } from '../types/gameStateActionTypes';

const Container = styled.div`
  margin: 2px;
  display: inline-block;
  border: 6px solid white;
  border-radius: 5px;
  padding: 20px 17px;
  background: black;
  position: relative;
  color: black;
  height: 60px;
  width: 30px;
  user-select: none;
`;

const Text = styled.div`
  color: brown;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(12deg);
`;

const CardPile: React.FC = () => {
  const { state, dispatch } = useContext(GameStateContext);

  const onClickHandler = (): void => {
    const isPlayersTurn = state.playerTurn === -1;
    if (!isPlayersTurn) return;
    dispatch({ name: Action.PlayerDrawsNewCard });
    dispatch({ name: Action.SetNextPlayerTurn });
  };

  return (
    <Container onClick={onClickHandler}>
      <Text>Bruno</Text>
    </Container>
  );
};

export default CardPile;
