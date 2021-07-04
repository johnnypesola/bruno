import { Illustration, Ellipse, Rect, Cylinder, Box, Cone, Group, useRender, Anchor, Shape } from 'react-zdog';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Anchor as ZdogAnchor } from 'zdog';

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  // display: flex;
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

const Glass: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <>
    <Cylinder
      diameter={10}
      length={10}
      rotate={{ x: -(TAU / 4) }}
      translate={{ x, y: y - 8, z }}
      stroke={true}
      color={'#699'}
      topFace={false}
    />
    <Cylinder
      diameter={8}
      length={3}
      rotate={{ x: -(TAU / 4) }}
      translate={{ x, y: y - 5, z }}
      stroke={false}
      color={'#B85'}
      frontFace={false}
      backface={'#C96'}
    />
    <Ellipse diameter={10} rotate={{ x: -(TAU / 4) }} translate={{ x, y: y - 14, z }} stroke={1} color={'#669292'} />
  </>
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
      diameter={14}
      length={7}
      rotate={{ x: -(TAU / 4) }}
      translate={{ x, y: y - 10, z }}
      stroke={false}
      color={'#B85'}
      frontFace={false}
      backface={'#C96'}
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

const Hotdog: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group updateSort={true}>
    <Ellipse
      diameter={30}
      translate={{ x, y: y - 31, z: z - 1 }}
      stroke={2}
      quarters={1}
      rotate={{ x: -(TAU / 2), z: -(TAU / 8) }}
      color={'#C25'}
    />
    <Ellipse
      diameter={30}
      translate={{ x, y: y - 31, z: z + 1 }}
      stroke={2}
      quarters={1}
      rotate={{ x: -(TAU / 2), z: -(TAU / 8) }}
      color={'#EA0'}
    />
    <Ellipse
      diameter={40}
      translate={{ x, y: y - 30, z }}
      stroke={10}
      quarters={1}
      rotate={{ x: -(TAU / 2), z: -(TAU / 8) }}
      color={'#622'}
    />
    <Shape
      path={[
        { x: x - 10, y: y - 10, z: z + 8 },
        { x: x + 10, y: y - 10, z: z + 8 },
      ]}
      stroke={8}
      color={'#e62'}
    />
    <Shape
      path={[
        { x: x - 10, y: y - 10, z: z - 8 },
        { x: x + 10, y: y - 10, z: z - 8 },
      ]}
      stroke={8}
      color={'#e62'}
    />
    <Shape
      path={[
        { x: x - 5, y: y - 10, z: z },
        { x: x + 5, y: y - 10, z: z },
      ]}
      stroke={16}
      color={'#e62'}
    />
  </Group>
);

const Fork: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Shape
    rotate={{ z: TAU / 8 }}
    path={[
      // triangle
      { z, x: x + 14, y: y + -20 },
      { z, x: x + 12, y: y + -18 },
      { z, x: x + 13, y: y + 3 },
      { z, x: x + 11, y: y + 4 },
      { z, x: x + 10, y: y + 6 },
      { z, x: x + 11, y: y + 15 },
      { z, x: x + 12, y: y + 4 },
      { z, x: x + 14, y: y + 15 },
      { z, x: x + 16, y: y + 4 },
      { z, x: x + 17, y: y + 15 },
      { z, x: x + 18, y: y + 6 },
      { z, x: x + 17, y: y + 4 },
      { z, x: x + 15, y: y + 3 },
      { z, x: x + 16, y: y + -18 },
    ]}
    // closed by default
    stroke={0.8}
    color={'#888'}
    fill
  />
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
    {/* <Ellipse diameter={5} rotate={{ x: -(TAU / 4) }} translate={{ z, x, y: y - 15.2 }} stroke={1} color={'#e62'} /> */}
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
  opacity: 0.95;
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
        <Table />
        <Glass translate={{ x: 20, y: 0, z: -70 }} />
        <Hotdog translate={{ x: 70, y: 0, z: 0 }} />
        {/* <Fork translate={{ x: 20, y: -70, z: 0 }} /> */}
        <Cards translate={{ x: -40, y: 0, z: 20 }} />
        <Bottle translate={{ x: -60, y: 0, z: -30 }} />
      </Group>
    </Anchor>
  );
};

export default GfxRoot;
