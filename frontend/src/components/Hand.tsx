import styled from 'styled-components';
import { TablePosition } from '../types/commonTypes';

const getTablePositionStyle = (tablePosition: TablePosition): string => {
  switch (tablePosition) {
    case TablePosition.Player:
      return `
        position: fixed;
        bottom: 0px;
        transform: rotateZ(0) rotateX(-22deg) rotateY(0deg) translateZ(20px) translateX(-10px) translateY(0px);`;
    case TablePosition.OpponentLeft:
      return `
        position: fixed;
        left: 290px;
        transform: rotateZ(-350deg) rotateX(-70deg) rotateY(58deg) translateZ(-140px) translateX(-180px) translateY(-90px) skew(0deg, 10deg)`;
    case TablePosition.OpponentRight:
      return `
        position: fixed;
        right: 290px;
        transform: rotateZ(-350deg) rotateX(-70deg) rotateY(-22deg) translateZ(-140px) translateX(238px) translateY(-90px) skew(0deg, -2deg)`;

    default:
      return '';
  }
};

const getCardMargin = (cardsCount: number, isPlayer: boolean): string => {
  const factor = isPlayer ? 3 : 8;
  const mininumMargin = isPlayer ? -40 : -60;
  const val = Math.max(cardsCount * -factor, mininumMargin);
  return `2px 2px 2px ${val}px`;
};

interface HandProps {
  tablePosition: TablePosition;
  cardsCount: number;
}

export default styled.div<HandProps>`
  margin: 20px;
  ${({ tablePosition }) => getTablePositionStyle(tablePosition)};

  > * {
    margin: ${({ cardsCount, tablePosition }) => {
      const isPlayer = tablePosition === TablePosition.Player;
      return getCardMargin(cardsCount, isPlayer);
    }};
  }
`;
