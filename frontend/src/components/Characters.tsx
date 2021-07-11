import styled from 'styled-components';
import React, { useContext, useState } from 'react';

import avatar1 from './img/avatar1.png';
import avatar2 from './img/avatar2.png';
import avatar3 from './img/avatar3.png';
import avatar4 from './img/avatar4.png';

import { GameStateContext } from '..';
import { ClientEvent } from '../types/clientEventTypes';
import { Character } from '../types/commonTypes';

const images = [avatar1, avatar2, avatar3, avatar4];

export const characters: Character[] = [
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
}

const Avatar = styled.img.attrs<Props>(({ characterId }) => ({ src: images[characterId - 1] }))<Props>`
  margin: 20px 0;
  background: #636;
  border: 10px solid #ea0;
  border: 3px solid #aaa;
  width: 200px;
  height: 200px;
`;

const Avatars: React.FC = () => {
  const { socket } = useContext(GameStateContext);
  const [visibleCharacter, setVisibleCharacter] = useState(characters[0]);

  const selectCharacter = (id: number): void => {
    socket.emit(ClientEvent.SelectCharacter, id);
  };

  const nextCharacter = (): void => {
    const currentIndex = characters.indexOf(visibleCharacter);

    const nextIndex = !characters[currentIndex + 1] ? 0 : currentIndex + 1;
    setVisibleCharacter(characters[nextIndex]);
  };

  return (
    <>
      {/* {characters.map(({ id, name }) => ( */}
      <>
        <Avatar key={visibleCharacter.id} characterId={visibleCharacter.id} />
        <button onClick={() => nextCharacter()}>Next</button>
        <button onClick={() => selectCharacter(visibleCharacter.id)}>Select</button>
      </>
      {/* ))} */}
    </>
  );
};

export default Avatars;
