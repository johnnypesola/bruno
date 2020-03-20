import React from 'react';
import styled from 'styled-components';

export enum CardColor {
  Red = 'red',
  Green = 'green',
  Yellow = 'gold',
  Blue = 'blue',
}

export enum CardValue {
  Zero = '0',
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
}

interface ComponentProps {
  value: CardValue;
  color: CardColor;
  isConcealed: boolean;
}

const CardContainer = styled.div<{ cardColor: CardColor; isConcealed: boolean }>`
  margin: 2px;
  display: inline-block;
  border: 6px solid white;
  border-radius: 5px;
  padding: 20px 17px;
  background: ${({ isConcealed, cardColor }) => (isConcealed ? 'black' : cardColor)};
  position: relative;
  color: black;
  height: 60px;
  width: 30px;
  user-select: none;
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

const Card: React.FC<ComponentProps> = ({ color, value, isConcealed }) => (
  <CardContainer cardColor={color} isConcealed={isConcealed}>
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
