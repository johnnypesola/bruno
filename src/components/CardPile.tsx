import React, { useContext } from 'react';
import styled from 'styled-components';
import { GameStateContext } from '..';
import Card from './Card';

const Container = styled.div`
  position: relative;
  height: 100px;
  width: 100px;
  margin-left: 50px;

  > * {
    position: absolute;

    animation-duration: 0.3s;
    animation-name: laycard;
  }

  @keyframes laycard {
    from {
      margin-top: -100%;
      opacity: 0;
    }

    to {
      margin-top: 0%;
      opacity: 1;
    }
  }
`;

const CardPile: React.FC = () => {
  const { state } = useContext(GameStateContext);

  return (
    <Container>
      {state.cardPile.map((cardInPile, index) => (
        <Card
          key={index}
          color={cardInPile.color}
          value={cardInPile.value}
          isConcealed={false}
          rotation={cardInPile.rotation}
          offsetX={cardInPile.offsetX}
          offsetY={cardInPile.offsetY}
        />
      ))}
    </Container>
  );
};

export default CardPile;
