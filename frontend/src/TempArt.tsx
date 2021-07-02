import { Illustration, Ellipse, Rect, Cylinder, Box, Cone, Group, useRender, Anchor } from 'react-zdog';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Anchor as ZdogAnchor } from 'zdog';

const Container = styled.div`
  position: relative;
  height: 800px;
  width: 800px;
`;

const TAU = Math.PI * 2;

type Translate = { translate: { x: number; y: number; z: number } };

const TableLeg: React.FC<Translate> = ({ translate }) => (
  <Group updateSort={true}>
    <Ellipse diameter={100} rotate={{ x: -(TAU / 4) }} translate={{ y: 110 }} stroke={10} color={'#C25'} fill />
    <Box
      width={20}
      height={60}
      depth={20}
      translate={{ ...translate, y: translate.y - 20 }}
      rotate={{ y: 1 }}
      stroke={false}
      color={'#C25'} // default face color
    />
    <Box
      width={20}
      height={40}
      depth={20}
      translate={{ ...translate, y: translate.y + 30 }}
      rotate={{ y: 1 }}
      stroke={false}
      color={'#C25'} // default face color
      leftFace={'#E62'}
      rightFace={'#E62'}
      topFace={false}
    />
  </Group>
);

const Bottle: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <>
    <Cylinder
      diameter={10}
      length={5}
      rotate={{ x: -(TAU / 4) }}
      translate={{ x, y: y - 45, z }}
      stroke={false}
      color={'#2a2'}
      frontFace={'#2a2'}
      backface={'#2a2'}
    />
    <Cylinder
      diameter={7}
      length={15}
      rotate={{ x: -(TAU / 4) }}
      translate={{ x, y: y - 38, z }}
      stroke={false}
      color={'#2a2'}
      frontFace={'#2a2'}
      backface={'#2a2'}
    />

    <Cylinder
      diameter={17}
      length={20}
      rotate={{ x: -(TAU / 4) }}
      translate={{ x, y: y - 15, z }}
      stroke={false}
      color={'#2a2'}
      frontFace={'#2a2'}
      backface={'#2a2'}
    />

    <Cone
      diameter={17}
      length={12}
      rotate={{ x: TAU / 4 }}
      stroke={false}
      color={'#2a2'}
      translate={{ x, y: y - 25, z }}
    />
    <Cylinder
      diameter={6}
      length={2}
      rotate={{ x: -(TAU / 4) }}
      translate={{ x, y: y - 48, z }}
      stroke={false}
      color={'#E62'}
    />
  </>
);

const Cards: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group updateSort={true}>
    <Box
      width={12}
      height={20}
      depth={10}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#DDD'} // default face color
      bottomFace={'#AAA'}
      topFace={'#AAA'}
      rearFace={false}
      fill
      translate={{ z, x, y: y - 10 }}
    />
    <Rect
      width={9}
      height={17}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#622'}
      // rearFace={false}
      fill
      translate={{ z, x, y: y - 15.1 }}
    />
  </Group>
);

const Table: React.FC = () => (
  <>
    <Cylinder
      diameter={200}
      length={10}
      rotate={{ x: -(TAU / 4) }}
      stroke={false}
      color={'#C25'}
      frontFace={'#636'}
      backface={'#EA0'}
    />

    <Ellipse diameter={182} rotate={{ x: -(TAU / 4) }} translate={{ y: -5 }} stroke={0} color={'#164'} fill />
  </>
);

const BrunoLogoText = styled.h1`
  position: absolute;
  font-size: 70px;
  font-weight: bold;
  letter-spacing: -0.08em;
  text-transform: uppercase;
  color: #c25;
  text-shadow: -2px -2px 0px #e62;
  top: 20px;
  left: 100px;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  transform: rotate(2deg);
`;

const GfxRoot: React.FC = () => (
  <Container>
    <BrunoLogoText>Bruno</BrunoLogoText>
    <Illustration zoom={3.5} dragRotate={false} rotate={{ y: 0, x: -(Math.PI / 6) }} resize="fullscreen">
      <Art />
    </Illustration>
  </Container>
);

const Art: React.FC = () => {
  const elRef = useRef<ZdogAnchor>();
  const [isRotating, setIsRotating] = useState(true);
  useRender((t: unknown) => {
    if (!elRef || !elRef.current) return;
    if (isRotating) elRef.current.rotate.y += 0.005;
  });

  return (
    <Anchor ref={elRef}>
      <Group onClick={() => setIsRotating(!isRotating)}>
        <TableLeg translate={{ y: 55, x: 0, z: 0 }} />
        <Table />
        <Cards translate={{ x: -40, y: 0, z: 20 }} />
        <Bottle translate={{ x: -60, y: 0, z: -30 }} />
      </Group>
    </Anchor>
  );
};

export default GfxRoot;
