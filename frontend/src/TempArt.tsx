import { Illustration, Ellipse, Rect, Cylinder, Box, Shape } from 'react-zdog';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 800px;
  width: 800px;
`;

const TAU = Math.PI * 2;

type Translate = { translate: { x: number; y: number; z: number } };

const TableLeg: React.FC<Translate> = ({ translate }) => (
  <>
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
      bottomFace={'#636'}
    />
    <Box
      width={20}
      height={40}
      depth={20}
      translate={{ ...translate, y: translate.y - 10 }}
      rotate={{ y: 1 }}
      stroke={false}
      color={'#C25'} // default face color
      leftFace={'#C25'}
      rightFace={'#C25'}
      topFace={false}
      bottomFace={'#636'}
    />

    <Ellipse diameter={100} rotate={{ x: -(TAU / 4) }} translate={{ y: 110 }} stroke={10} color={'#C25'} fill />
  </>
);

const Cards: React.FC = () => (
  <>
    <Box
      width={12}
      height={20}
      depth={8}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#DDD'} // default face color
      frontFace={'#FFF'}
      rightFace={'#AAA'}
      leftFace={'#AAA'}
      rearFace={false}
      fill
      translate={{ z: 20, x: -10, y: -10 }}
    />
    <Rect
      width={9}
      height={17}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#622'}
      fill
      translate={{ z: 20, x: -10, y: -14.1 }}
    />
    {/* <Box
      width={12}
      height={20}
      depth={20}
      translate={{ z: 20, x: -10, y: -10.5 }}
      rotate={{ x: TAU / 4, z: -(TAU / 8) }}
      stroke={3}
      color={'#C25'} // default face color
      leftFace={'#C25'}
      rightFace={'#C25'}
      topFace={false}
      bottomFace={'#636'} 
    />*/}
  </>
);

const Table: React.FC = () => (
  <>
    <TableLeg translate={{ y: 55, x: 0, z: 0 }} />
    <Cylinder
      diameter={200}
      length={10}
      rotate={{ x: -(TAU / 4) }}
      // rotate={{ x: TAU / 4, y: TAU / 3 }}
      stroke={false}
      color={'#C25'}
      frontFace={'#636'}
      backface={'#EA0'}
    />

    <Ellipse diameter={182} rotate={{ x: -(TAU / 4) }} translate={{ y: -5 }} stroke={0} color={'#164'} fill />
  </>
);

const TempArt: React.FC = () => {
  const TAU = Math.PI * 2;

  return (
    <Container>
      <Illustration zoom={3.5} dragRotate={true} rotate={{ x: -(Math.PI / 6) }} height="200">
        <Table />
        <Cards />
      </Illustration>
    </Container>
  );
};

export default TempArt;
