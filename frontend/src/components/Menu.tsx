import styled from 'styled-components';
import React, { useCallback, useContext } from 'react';
import { ClientEvent } from '../types/clientEventTypes';
import { GameStateContext } from '..';
import Avatars from './Characters';
import Characters from './Characters';

const LogoText = styled.h1`
  font-size: 3em;
  font-weight: bold;
  letter-spacing: -0.08em;
  text-transform: uppercase;
  margin: 0;
  color: #622;
  text-shadow: -3px 0px 0px #622;
  transform: rotate(-3deg);
  height: 1em;
  line-height: 1.6em;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;

const LogoCircle = styled.div`
  margin-top: 1em;
  text-align: center;
  width: 260px;
  height: 115px;
  border-radius: 50%;
  background: #e62;
  transform: skew(5deg, 3deg);
`;

const Menu = styled.div`
  color: #e62;
  position: fixed;
  top: 0;
  left: 0;
  background: #622;
  height: 100%;
  width: 300px;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  user-select: none;
`;

const MenuHeader = styled.h3`
  line-height: 1.3em;
  margin: 1em 0 0 0;
  width: 100%;
  text-align: center;
  transform: rotate(2deg);
  text-deco
`;

const MenuButton = styled.h3`
  line-height: 1.3em;
  margin: 1em 0 0 0;
  width: 100%;
  text-align: center;

  &:hover {
    color: #622;
    background: #e62;
  }

  &:nth-child(odd) {
    transform: rotate(1deg);
    border-bottom-right-radius: 20%;
    border-bottom-left-radius: 5%;
    border-top-left-radius: 70%;
  }

  &:nth-child(even) {
    transform: rotate(-1deg);
    border-bottom-right-radius: 40%;
    border-bottom-left-radius: 15%;
    border-top-left-radius: 30%;
  }
`;

const MenuComponent: React.FC = () => {
  const { state } = useContext(GameStateContext);

  return (
    <>
      {state.gameStage === 'characterSelection' && (
        <Menu>
          <LogoCircle>
            <LogoText>Bruno</LogoText>
          </LogoCircle>
          <MenuHeader>WHO ARE YOU?</MenuHeader>
          <Characters />
        </Menu>
      )}
    </>
  );
};

export default MenuComponent;
