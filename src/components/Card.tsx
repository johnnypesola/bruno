import React from 'react';
import styled from 'styled-components';
import { CardValue, CardColor } from '../types/commonTypes';

interface ComponentProps {
  value: CardValue;
  color: CardColor;
  isConcealed: boolean;
  onClick?: () => void;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
}

const CardContainer = styled.div<ComponentProps>`
  margin: 2px;
  display: inline-block;
  border: 6px solid white;
  border-radius: 5px;
  padding: 20px 17px;
  background: ${({ isConcealed, color }) => (isConcealed ? 'black' : color)};
  position: relative;
  color: black;
  height: 60px;
  width: 30px;
  user-select: none;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
  ${({ offsetX }) => (offsetX ? `left: ${offsetX}px;` : '')}
  ${({ offsetY }) => (offsetY ? `top: ${offsetY}px;` : '')}
  ${({ rotation }) => (rotation ? `transform: rotate(${rotation}deg);` : '')}
  ${({ onClick }) => (onClick ? 'cursor: pointer;' : '')}
`;

const Circle = styled.div`
  height: 90px;
  width: 50px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 5px;
  left: 7px;
  transform: rotate(35deg);
`;

const ValueContainer = styled.div<{ cardColor: CardColor }>`
  font-family: 'verdana';
  font-weight: bold;
  font-style: italic;
  font-size: 45px;
  position: absolute;
  top: 20px;
  left: 15px;
  color: ${props => props.cardColor};
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
`;

const Text = styled.div`
  color: brown;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(12deg);
`;

const Card: React.FC<ComponentProps> = ({ color, value, isConcealed, onClick, rotation, offsetX, offsetY }) => (
  <CardContainer
    color={color}
    isConcealed={isConcealed}
    onClick={onClick}
    rotation={rotation}
    offsetX={offsetX}
    offsetY={offsetY}
    value={value}
  >
    {!isConcealed && (
      <>
        <Circle />
        <ValueContainer cardColor={color}>{value}</ValueContainer>
      </>
    )}
    {isConcealed && <Text>Bruno</Text>}
  </CardContainer>
);

export default Card;
