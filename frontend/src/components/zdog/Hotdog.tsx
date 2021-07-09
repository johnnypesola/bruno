import { Group, Ellipse, Shape } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './TempArt';

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

export default Hotdog;
