import { Cylinder, Group, Ellipse } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './TempArt';

const Glass: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group>
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
  </Group>
);

export default Glass;
