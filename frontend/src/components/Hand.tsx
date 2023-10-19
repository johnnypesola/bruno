import styled from 'styled-components';
import { FCWithChildren } from '../types/clientSideTypes';
import React from 'react';

const getTablePositionStyle = (tablePosition: number, numberOfPlayers: number): string => {
  const scale = 1 - numberOfPlayers * 0.1;

  switch (tablePosition) {
    case 0:
      return `
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        transform: rotateZ(0) rotateX(-22deg) rotateY(0deg) translateZ(80px) translateX(-10px) translateY(-7px);`;
    case 1:
      return `
        position: absolute;
        left: 0px;
        // transform: rotateZ(-350deg) rotateX(-70deg) rotateY(58deg) translateZ(-140px) translateX(-180px) translateY(-110px) skew(0deg, 10deg) scale(${scale})
        transform: rotateZ(-350deg) rotateX(-70deg) rotateY(58deg) translateZ(-60px) skew(0deg, 10deg) scale(${scale})`;
    case 2:
      return `
        position: absolute;
        left: 170px;
        // transform: rotateZ(-344deg) rotateX(-75deg) rotateY(36deg) translateZ(-51px) translateX(80px) translateY(-77px) skew(0deg,10deg) scale(${scale})
        // transform: rotateZ(-344deg) rotateX(-75deg) rotateY(36deg) translateZ(-100px) skew(0deg,10deg) scale(${scale})
        transform: rotateZ(-350deg) rotateX(-75deg) rotateY(36deg) translateZ(-110px) skew(0deg,10deg) scale(0.6)`;
    case 3:
      return `
        position: absolute;
        right: 100px;
        // // transform: rotateZ(-330deg) rotateX(-72deg) rotateY(33deg) translateZ(-66px) translateX(80px) translateY(-77px) skew(0deg,10deg) scale(${scale})
        transform: rotateZ(-333deg) rotateX(-72deg) rotateY(33deg) translateZ(-100px) skew(0deg,10deg) scale(${scale})`;
    case 4:
      return `
        position: absolute;
        right: -30px;
        // transform: rotateZ(-350deg) rotateX(-70deg) rotateY(-22deg) translateZ(-140px) translateX(238px) translateY(-90px) skew(0deg, -2deg) scale(${scale})
        transform: rotateZ(-350deg) rotateX(-70deg) rotateY(-22deg) translateZ(-60px) skew(0deg, -2deg) scale(${scale})`;

    default:
      return '';
  }
};

const getCardMargin = (cardsCount: number, isPlayer: boolean): string => {
  const factor = isPlayer ? 3 : 8;
  const mininumMargin = isPlayer ? -40 : -60;
  const maximumMargin = isPlayer ? -20 : 100;
  const val = Math.min(Math.max(cardsCount * -factor, mininumMargin), maximumMargin);
  return `0px 2px -5px ${val}px`;
};

const getHighlightedStyle = (isHighlighted: boolean): string => {
  if (!isHighlighted) return '';
  return `
    box-shadow: 0 0 30px 35px rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.7);
    border-radius: 20px;
  `;
};

interface HandProps {
  tablePosition: number;
  cardsCount: number;
  isHighlighted: boolean;
  numberOfPlayers: number;
}

const HandContainer = styled.div<HandProps>`
  margin: 20px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  ${({ tablePosition, numberOfPlayers }) => getTablePositionStyle(tablePosition, numberOfPlayers)};
  ${({ isHighlighted }) => getHighlightedStyle(isHighlighted)}

  > * {
    margin: ${({ cardsCount, tablePosition }) => {
      const isPlayer = tablePosition === 0;
      return getCardMargin(cardsCount, isPlayer);
    }};

    :hover {
      transform: translateZ(140px) translateY(-5px) scale(1.1);
      margin-right: 25px;
    }
    :last-child:hover {
      margin-right: 0;
    }

    transition: all 0.2s ease;
    animation-duration: 0.8s;
    animation-name: getcard;
    position: relative;
    overflow: hidden;
  }

  @keyframes getcard {
    from {
      bottom: 50px;
      opacity: 0;
    }

    to {
      bottom: 0;
      opacity: 1;
    }
  }
`;

const Hand: FCWithChildren<HandProps> = ({ children, numberOfPlayers, ...props }) => (
  <HandContainer numberOfPlayers={numberOfPlayers} {...props}>
    {children}
  </HandContainer>
);

export default Hand;
