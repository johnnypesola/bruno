import { Group, Box, Rect } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './TempArt';

const Cards: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group updateSort={true}>
    <Box
      width={12}
      height={20}
      depth={10}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#DDD'}
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
      fill
      translate={{ z, x, y: y - 15.1 }}
    />
  </Group>
);

export default Cards;
