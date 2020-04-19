import React, { useState } from 'react';
import styled from 'styled-components';

const PileContainer = styled.div`
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

const DrawCard = styled.div`
  margin: -24px;
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
  position: absolute;
  bottom: 20px;

  animation-duration: 0.8s;
  animation-name: drawcard;
  animation-fill-mode: forwards;

  @keyframes drawcard {
    from {
      opacity: 1;
      transform: rotateZ(0) rotateX(0) rotateY(0deg) translateZ(0px) translateX(0px) translateY(0);
    }

    to {
      opacity: 0;
      transform: rotateZ(-2deg) rotateX(40deg) rotateY(5deg) translateZ(0px) translateX(0px) translateY(120px);
    }
  }
`;

interface ComponentProps {
  onClick: () => void;
}

const CardDeck: React.FC<ComponentProps> = ({ onClick }) => {
  const [isDrawCardVisible, setIsDrawCardVisible] = useState(false);

  const handleOnClick = (): void => {
    onClick();
    setIsDrawCardVisible(true);
    setTimeout(() => {
      setIsDrawCardVisible(false);
    }, 800);
  };

  return (
    <>
      <PileContainer onClick={handleOnClick}>
        <Text>Bruno</Text>
        {isDrawCardVisible && <DrawCard />}
      </PileContainer>
    </>
  );
};

export default CardDeck;
