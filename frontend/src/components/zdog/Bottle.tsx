import { Group, Cylinder, Cone } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './TempArt';

const Bottle: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group>
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
  </Group>
);

export default Bottle;
