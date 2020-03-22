import styled from 'styled-components';
import { TablePosition } from '../types/commonTypes';

const getTablePositionStyle = (tablePosition: TablePosition): string => {
  switch (tablePosition) {
    case TablePosition.Player:
      return 'transform: rotateZ(0) rotateX(-22deg) rotateY(0deg) translateZ(0px) translateX(-10px) translateY(0px);';
    case TablePosition.OpponentLeft:
      return `
        // position: absolute;
        transform: rotateZ(-360deg) rotateX(-59deg) rotateY(70deg) translateZ(-240px) translateX(20px) translateY(50px)`;
    case TablePosition.OpponentRight:
      return `
        // position: absolute;
        transform: rotateZ(-360deg) rotateX(-59deg) rotateY(-70deg) translateZ(-240px) translateX(20px) translateY(50px)`;

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
