import { throttle } from 'lodash';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { CardValue, CardColor, Coords } from '../types/commonTypes';
import { characterImages } from './Characters';

interface ComponentProps {
  value: CardValue;
  color: CardColor;
  isConcealed: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onDragUp?: () => void;
  onDragDown?: () => void;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  characterId?: number;
}

type CardContainerProps = ComponentProps & { x: number; y: number; isClickable: boolean };

const CardContainer = styled.div.attrs<CardContainerProps>(({ offsetX, x, offsetY, y }) => ({
  style: {
    top: offsetY ? `${offsetY + y}px` : `${y}px`,
    left: offsetX ? `${offsetX + x}px` : `${x}px`,
  },
}))<CardContainerProps>`
  margin: 2px;
  display: inline-block;
  border: 6px solid white;
  // border-radius: 5px;
  padding: 20px 17px;
  background: ${({ isConcealed, color }) => (isConcealed ? '#622' : color)};
  position: relative;
  color: black;
  height: 60px;
  width: 30px;
  user-select: none;
  // box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
  ${({ rotation }) => (rotation ? `transform: rotate(${rotation}deg);` : '')}
  ${({ isClickable }) => (isClickable ? 'cursor: pointer;' : '')}
`;

export const Character = styled.img.attrs<{ characterId: number }>(({ characterId }) => ({
  src: characterImages[characterId - 1],
}))<{ characterId: number }>`
  width: 70px;
  height: 100px;
  margin: -20px;
  filter: sepia(100%);
  opacity: 0.6;
  object-fit: cover;
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
  color: #222;
  color: ${(props) => props.cardColor};
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
`;

const Card: React.FC<ComponentProps> = ({
  color,
  value,
  isConcealed,
  isSelected,
  onClick,
  onDragUp,
  onDragDown,
  rotation,
  offsetX,
  offsetY,
  characterId,
}) => {
  const [initDragPos, setInitDragPos] = useState<Coords>();

  const dragTriggerYOffset = 5;

  const handleDragStart = useCallback((e: React.MouseEvent) => setInitDragPos({ x: e.pageX, y: e.pageY }), []);

  const handleClick = useCallback(() => onClick && onClick(), [onClick]);

  const handleDragEnd = useCallback(
    (e: React.MouseEvent) => {
      if (initDragPos) {
        const yOffset = e.pageY - initDragPos.y;
        if (Math.abs(yOffset) < dragTriggerYOffset) handleClick();
      }
      setInitDragPos(undefined);
    },
    [initDragPos, handleClick],
  );

  const handleDrag = useCallback(
    throttle((e: React.MouseEvent) => {
      if (!onDragUp || !onDragDown || !initDragPos || e.buttons !== 1) return;
      const yOffset = e.pageY - initDragPos.y;

      if (yOffset <= -dragTriggerYOffset) onDragUp();
      if (yOffset >= dragTriggerYOffset) onDragDown();
    }, 100),
    [initDragPos, dragTriggerYOffset, onDragUp, onDragDown],
  );
  return (
    <CardContainer
      color={color}
      isConcealed={isConcealed}
      rotation={rotation}
      offsetX={offsetX}
      offsetY={offsetY}
      value={value}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      x={0}
      y={isSelected ? -70 : 0}
      isClickable={!!onClick}
    >
      {!isConcealed && (
        <>
          <Circle />
          <ValueContainer cardColor={color}>{value}</ValueContainer>
        </>
      )}
      {isConcealed && characterId && <Character characterId={characterId} />}
    </CardContainer>
  );
};

export default Card;
