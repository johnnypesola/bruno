import { Illustration, Group, useRender, Anchor } from 'react-zdog';
import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Anchor as ZdogAnchor, Group as ZdogGroup } from 'zdog';
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
import { GameStateContext } from '../..';

export type Translate = { translate: { x: number; y: number; z: number } };

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  // display: flex;
`;

const GfxRoot: React.FC = () => {
  return (
    <Container>
      <Illustration
        zoom={3}
        dragRotate={false}
        rotate={{ y: 0, x: -(Math.PI / 6) }}
        // rotate={{ y: 0, x: -(Math.PI / 3) }}
        resize={true}
      >
        <Art />
      </Illustration>
    </Container>
  );
};

const Art: React.FC = () => {
  const containerRef = useRef<ZdogAnchor>();
  const stuffOnTableRef = useRef<ZdogGroup>();
  const isGameStarted = useRef<boolean>(false);
  const isGameInCharacterSelection = useRef<boolean>(false);
  const {
    state: { gameStage },
  } = useContext(GameStateContext);

  useEffect(() => {
    isGameStarted.current = gameStage === 'started';
    isGameInCharacterSelection.current = gameStage === 'characterSelection';
    if (containerRef.current) containerRef.current.rotate.y = 0;
  }, [gameStage]);

  useRender((t: unknown): void => {
    if (stuffOnTableRef.current) stuffOnTableRef.current.visible = !isGameStarted.current;
    if (containerRef.current && isGameInCharacterSelection.current) containerRef.current.rotate.y += 0.002;
  });

  return (
    <Anchor ref={containerRef}>
      <Group>
        <TableLeg translate={{ y: 55, x: 0, z: 0 }} />
        <SawBottom translate={{ x: 40, y: -2, z: -78 }} />
        <Table />
        <Group ref={stuffOnTableRef}>
          {/* <CardPile translate={{ x: 0, y: -5, z: 0 }} /> */}

          <Group updateSort={true}>
            <Hotdog translate={{ x: 30, y: 0, z: -60 }} />
            <Fork translate={{ x: -20, y: -42, z: -5 }} />
            <Dynamite translate={{ x: 35, y: -2, z: 70 }} />
            <Candle translate={{ x: 50, y: -1, z: 30 }} />
          </Group>

          {/* <Cards translate={{ x: -40, y: 0, z: 20 }} /> */}

          <Group updateSort={true}>
            <Bottle translate={{ x: -60, y: 0, z: -30 }} />
            <Glass translate={{ x: -45, y: -2, z: -40 }} />
          </Group>
          <Saw translate={{ x: 40, y: -2, z: -78 }} />
        </Group>
      </Group>
    </Anchor>
  );
};

export default GfxRoot;
