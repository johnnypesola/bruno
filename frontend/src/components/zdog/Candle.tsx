import { Cylinder, Cone, Group, Shape, Anchor } from 'react-zdog';
import React from 'react';
import { Translate } from './GfxRoot';
import { TAU } from 'zdog';

const Candle: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group>
    <Cylinder
      diameter={15}
      length={13}
      rotate={{ x: TAU / 4, z: -(TAU / 6) }}
      translate={{ z, x, y: y - 12 }}
      stroke={4}
      color={'#ddd'}
      fill
    />
    <Shape
      stroke={2}
      color={'#222'}
      path={[
        { z, x, y: y - 20 },
        { z, x, y: y - 22 },
      ]}
    />

    <Anchor scale={0.9} translate={{ x, z, y: 0 }}>
      <Cone
        diameter={5}
        length={12}
        rotate={{ x: TAU / 4, z: -(TAU / 6) }}
        translate={{ y: -29 }}
        stroke={2}
        backface={false}
        color={'#EA0'}
        fill
      />
      <Shape stroke={7} color={'#EA0'} translate={{ y: -28 }} />
      <Cone
        diameter={2}
        length={4}
        rotate={{ x: TAU / 4, z: -(TAU / 6) }}
        translate={{ y: -26 }}
        stroke={1}
        backface={false}
        color={'#e62'}
        fill
      />
      <Shape stroke={3} color={'#e62'} translate={{ y: -26 }} />
    </Anchor>
  </Group>
);

export default Candle;
