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
  position: relative;
  bottom: 20px;

  &:after {
    background-color: gray;
    background-image: linear-gradient(hsla(0, 0%, 100%, 0.25), hsla(0, 0%, 0%, 0.25));
    border-radius: 5px;
    content: '';
    height: 28px;
    left: -6px;
    position: absolute;
    top: 68px;
    width: 76px;
    transform: translateZ(0px) translateY(30px);
    z-index: -1;
  }
`;

const Text = styled.div`
  color: brown;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(12deg);
`;

const CardDeck: React.FC = () => {
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

export default CardDeck;
