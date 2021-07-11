import { Cylinder, Group, Ellipse } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './GfxRoot';

const Dynamite: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group updateSort={true}>
    <Cylinder
      diameter={8}
      length={60}
      rotate={{ y: (TAU / 3) * 2 }}
      translate={{ x, y: y - 7, z }}
      stroke={0}
      color={'#C25'}
      backface={'#e62'}
    />
    <Ellipse
      diameter={30}
      translate={{ x: x + 19, y: y - 7, z: z - 28 }}
      stroke={2}
      quarters={1}
      rotate={{ x: TAU / 4, z: 1 }}
      color={'#622'}
    />
  </Group>
);

export default Dynamite;
