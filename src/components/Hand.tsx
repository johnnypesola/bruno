import styled from 'styled-components';
import { TablePosition } from '../types/commonTypes';

const getTablePositionStyle = (tablePosition: TablePosition): string => {
  switch (tablePosition) {
    case TablePosition.Player:
      return 'transform: rotateZ(0) rotateX(-22deg) rotateY(0deg) translateZ(0px) translateX(-10px) translateY(0px);';
    case TablePosition.OpponentLeft:
      return `
        position: fixed;
        transform: rotateZ(-350deg) rotateX(-70deg) rotateY(58deg) translateZ(-140px) translateX(-180px) translateY(-90px) skew(0deg, 10deg)`;
    case TablePosition.OpponentRight:
      return `
        position: fixed;
        transform: rotateZ(-350deg) rotateX(-70deg) rotateY(-22deg) translateZ(-115px) translateX(238px) translateY(-42px) skew(0deg, -2deg)`;

    default:
      return '';
  }
};

interface HandProps {
  tablePosition: TablePosition;
}

export default styled.div<HandProps>`
  margin: 20px;
  // position: absolute;
  ${({ tablePosition }) => getTablePositionStyle(tablePosition)}
`;
