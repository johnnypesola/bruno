import styled from 'styled-components';
import React, { useContext, useMemo } from 'react';
import { GameStateContext } from '..';
import Characters from './Characters';
import { maxNumberOfPlayers } from '../constants';

const LogoText = styled.h1`
  font-size: 1.5em;
  font-weight: bold;
  letter-spacing: -0.08em;
  text-transform: uppercase;
  margin: 0;
  color: #622;
  text-shadow: -1px 0px 0px #622;
  transform: rotate(-3deg);
  height: 1em;
  line-height: 1.6em;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;

const LogoCircle = styled.div`
  margin-top: 10px;
  margin-left: 10px;
  text-align: center;
  width: 6em;
  height: 2.5em;
  border-radius: 50%;
  background: #e62;
  transform: skew(5deg, 3deg);
  position: absolute;
  left: 0;
  top: 0;
`;

const Menu = styled.div`
  background: rgba(0, 0, 0, 0.3);
  color: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  user-select: none;
`;

const MenuHeader = styled.h3`
  line-height: 1.3em;
  margin: 1.5em 0 0 0;
  width: 100%;
  text-align: center;
  transform: rotate(2deg);
  text-transform: uppercase;
  text-shadow: -2px 2px 0px #622;
`;

const MenuComponent: React.FC = () => {
  const { state } = useContext(GameStateContext);

  const isInCharacterSelection = state.gameStage === 'characterSelection';
  const playerHasCharacter = !!state.player.characterId;
  const playerIsObserver = state.gameStage === 'started' && !playerHasCharacter;

  const isMinOpponentsWithoutCharacter = useMemo(() => {
    const opponentsWithCharactersCount = state.opponents.filter((opponent) => !!opponent.characterId).length;
    const isSomeOpponentWithoutCharacter = state.opponents.some((opponent) => opponent.characterId === undefined);
    return (
      opponentsWithCharactersCount + (playerHasCharacter ? 1 : 0) < maxNumberOfPlayers && isSomeOpponentWithoutCharacter
    );
  }, [state.opponents, playerHasCharacter]);

  const isMaxNumberOfOpponents = useMemo(
    () => state.opponents.filter((opponent) => opponent.characterId).length >= maxNumberOfPlayers,
    [state.opponents],
  );

  const isWaitingForOpponents = state.opponents.length === 0 || isMinOpponentsWithoutCharacter;

  const isMenuVisible =
    (isInCharacterSelection && isWaitingForOpponents) ||
    (isInCharacterSelection && !playerHasCharacter) ||
    playerIsObserver;

  return (
    <>
      {isMenuVisible && (
        <Menu>
          <LogoCircle>
            <LogoText>Bruno</LogoText>
          </LogoCircle>
          {isInCharacterSelection && !playerHasCharacter && !isMaxNumberOfOpponents && (
            <>
              <MenuHeader>Choose character</MenuHeader>
              <Characters />
            </>
          )}
          {playerHasCharacter && isWaitingForOpponents && !isMaxNumberOfOpponents && (
            <MenuHeader>Waiting for other players</MenuHeader>
          )}
          {!playerIsObserver && isMaxNumberOfOpponents && (
            <MenuHeader>Max number of players reached ({maxNumberOfPlayers}).</MenuHeader>
          )}
          {playerIsObserver && (
            <MenuHeader>
              Game is ongoing.
              <br />
              Join the next one.
            </MenuHeader>
          )}
        </Menu>
      )}
    </>
  );
};

export default MenuComponent;
