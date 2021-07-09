import { Illustration, Group, useRender, Anchor } from 'react-zdog';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Anchor as ZdogAnchor } from 'zdog';
import Candle from './Candle';
import Table from './Table';
import Hotdog from './Hotdog';
import Fork from './Fork';
import Glass from './Glass';
import Bottle from './Bottle';
import Cards from './Cards';
import CardPile from './CardPile';
import TableLeg from './TableLeg';
import Dynamite from './Dynamite';
import Saw from './Saw';
import SawBottom from './SawBottom';

export type Translate = { translate: { x: number; y: number; z: number } };

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  // display: flex;
`;

const LogoText = styled.h1`
  font-size: 3em;
  font-weight: bold;
  letter-spacing: -0.08em;
  text-transform: uppercase;
  margin: 0;
  color: #622;
  text-shadow: -3px 0px 0px #622;
  transform: rotate(-3deg);
  height: 1em;
  line-height: 1.6em;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;

const LogoCircle = styled.div`
  margin-top: 1em;
  text-align: center;
  width: 260px;
  height: 115px;
  border-radius: 50%;
  background: #e62;
  transform: skew(5deg, 3deg);
`;

const Menu = styled.div`
  color: #e62;
  position: absolute;
  left: 0;
  background: #622;
  height: 100%;
  width: 300px;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  user-select: none;
`;

const MenuItem = styled.h3`
  line-height: 1.3em;
  margin: 1em 0 0 0;
  font-family: Segoe UI, Frutiger, Dejavu Sans, Helvetica Neue, Arial, sans-serif;
  width: 100%;
  text-align: center;
  // border-radius: 5em;

  &:hover {
    color: #622;
    background: #e62;
  }

  &:nth-child(odd) {
    transform: rotate(1deg);
  }
  &:nth-child(odd):hover {
    border-bottom-right-radius: 20%;
    border-bottom-left-radius: 5%;
    border-top-left-radius: 70%;
  }

  &:nth-child(even) {
    transform: rotate(-1deg);
  }
  &:nth-child(even):hover {
    border-bottom-right-radius: 40%;
    border-bottom-left-radius: 15%;
    border-top-left-radius: 30%;
  }
`;

const GfxRoot: React.FC = () => (
  <Container>
    <Menu>
      <LogoCircle>
        <LogoText>Bruno</LogoText>
      </LogoCircle>
      <MenuItem>LET&apos;S PLAY</MenuItem>
      <MenuItem>SPECTATE</MenuItem>
    </Menu>
    <Illustration zoom={3.5} dragRotate={true} rotate={{ y: 0, x: -(Math.PI / 6) }} resize={true}>
      <Art />
    </Illustration>
  </Container>
);

const Art: React.FC = () => {
  const elRef = useRef<ZdogAnchor>();
  const [isRotating, setIsRotating] = useState(true);
  useRender((t: unknown) => {
    if (!elRef || !elRef.current) return;
    if (isRotating) elRef.current.rotate.y += 0.001;
  });

  return (
    <Anchor ref={elRef}>
      <Group>
        <TableLeg translate={{ y: 55, x: 0, z: 0 }} />
        <SawBottom translate={{ x: 40, y: -2, z: -78 }} />
        <Table />
        <CardPile translate={{ x: 0, y: -5, z: 0 }} />
        <Group updateSort={true}>
          <Hotdog translate={{ x: 70, y: 0, z: 0 }} />
          <Fork translate={{ x: 5, y: -42, z: 10 }} />
          <Dynamite translate={{ x: 30, y: -2, z: 70 }} />
          <Candle translate={{ x: 30, y: -1, z: 30 }} />
        </Group>
        <Cards translate={{ x: -40, y: 0, z: 20 }} />
        <Group updateSort={true}>
          <Bottle translate={{ x: -60, y: 0, z: -30 }} />
          <Glass translate={{ x: -45, y: -2, z: -40 }} />
        </Group>
        <Saw translate={{ x: 40, y: -2, z: -78 }} />
      </Group>
    </Anchor>
  );
};

export default GfxRoot;
