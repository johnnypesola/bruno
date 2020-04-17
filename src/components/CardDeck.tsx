import React from 'react';
import styled from 'styled-components';

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
  cursor: pointer;

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

interface ComponentProps {
  onClick: () => void;
}

const CardDeck: React.FC<ComponentProps> = ({ onClick }) => {
  return (
    <Container onClick={onClick}>
      <Text>Bruno</Text>
    </Container>
  );
};

export default CardDeck;
