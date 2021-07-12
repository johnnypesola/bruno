import styled from 'styled-components';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import avatar1 from './img/avatar1.png';
import avatar2 from './img/avatar2.png';
import avatar3 from './img/avatar3.png';
import avatar4 from './img/avatar4.png';

import { GameStateContext } from '..';
import { ClientEvent } from '../types/clientEventTypes';
import { CharacterType } from '../types/commonTypes';

export const characterImages = [avatar1, avatar2, avatar3, avatar4];

export const characters: CharacterType[] = [
  {
    id: 1,
    name: 'Harry Bonkers',
  },
  {
    id: 2,
    name: 'Klaus Christmas',
  },
  {
    id: 3,
    name: 'Fishy McHeist',
  },
  {
    id: 4,
    name: 'Rutger',
  },
];

interface Props {
  characterId: number;
  isOpponent?: boolean;
  isPlayer?: boolean;
}

export const Character = styled.img.attrs<Props>(({ characterId }) => ({
  src: characterImages[characterId - 1],
}))<Props>`
  pointer-events: none;
  margin-top: 20px;
  background: #636;
  border: 10px solid #ea0;
  border: 3px solid #aaa;
  width: 200px;
  height: 200px;
  ${({ isOpponent }) =>
    isOpponent
      ? `
  position: absolute;
  top: -140px;
  `
      : ''}
  ${({ isPlayer }) =>
    isPlayer
      ? `
  bottom: 0px;
  position: absolute !important;
  bottom: 130px !important;
  height: 50px;
  width: 50px;
  object-fit: cover;
}
  `
      : ''}
`;

const Button = styled.button`
  border: 1px solid white;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background: transparent;
  margin: 10px 5px;
  padding: 10px;
  cursor: pointer;
`;

const Characters: React.FC = () => {
  const { socket, state } = useContext(GameStateContext);
  const [visibleCharacter, setVisibleCharacter] = useState(characters[0]);

  const availableCharacters = useMemo(() => {
    const takenCharacterIds = state.opponents.map((opponent) => opponent.characterId);
    return characters.filter((char) => !takenCharacterIds.includes(char.id));
  }, [state.opponents]);

  const selectCharacter = (id: number): void => {
    socket.emit(ClientEvent.SelectCharacter, id);
  };

  const nextCharacter = useCallback((): void => {
    const currentIndex = availableCharacters.indexOf(visibleCharacter);
    const nextIndex = availableCharacters[currentIndex + 1] === undefined ? 0 : currentIndex + 1;
    setVisibleCharacter(availableCharacters[nextIndex]);
  }, [visibleCharacter, availableCharacters]);

  useEffect(() => {
    if (!availableCharacters.includes(visibleCharacter)) setVisibleCharacter(availableCharacters[0]);
  }, [availableCharacters, visibleCharacter, nextCharacter]);

  return (
    <>
      <Character key={visibleCharacter.id} characterId={visibleCharacter.id} />
      <h3>{visibleCharacter.name}</h3>
      <p></p>
      <Button onClick={() => nextCharacter()}>Next please</Button>
      <Button onClick={() => selectCharacter(visibleCharacter.id)}>This is the way</Button>
    </>
  );
};

export default Characters;
