import { Group, Ellipse, Box } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './GfxRoot';

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

export default TableLeg;
