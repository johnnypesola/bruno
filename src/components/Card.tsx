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
}

const CardContainer = styled.div<{ cardColor: CardColor }>`
  margin: 2px;
  display: inline-block;
  border: 6px solid white;
  border-radius: 5px;
  padding: 20px 17px;
  background: ${props => props.cardColor};
  position: relative;
  color: black;
  height: 60px;
  width: 30px;
  user-select: none;
`;

const WhiteCircle = styled.div`
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

const Card: React.FC<ComponentProps> = ({ color, value }) => (
  <CardContainer cardColor={color}>
    <WhiteCircle />
    <ValueContainer cardColor={color}>{value}</ValueContainer>
  </CardContainer>
);

export default Card;
