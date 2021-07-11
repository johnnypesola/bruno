import { Shape, Group } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './GfxRoot';

const Saw: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group rotate={{ y: TAU / 8 }}>
    <Shape
      path={[
        { z: z + 6, x: x, y: y - 20 },
        { z: z + 3, x, y: y - 17 },
        { z: z + 6, x, y: y - 15 },
        { z: z + 3, x, y: y - 12 },
        { z: z + 6, x, y: y - 9 },
        { z: z + 3, x, y: y - 6 },
        { z: z + 6, x, y: y - 3 },
        { z: z - 13, x: x, y: y - 3 },
        { z: z - 14, x: x, y: y - 20 },
      ]}
      stroke={0.8}
      color={'#622'}
      fill
    />

    <Shape
      path={[
        { z: z - 14, x: x, y: y - 20 },
        { z: z - 15, x: x, y: y - 34 },
        { z: z - 13, x: x, y: y - 32 },
        { z: z, x: x, y: y - 32 },
        { z: z + 1, x: x, y: y - 34 },
        { z: z, x: x, y: y - 20 },
        { z: z - 14, x: x, y: y - 20 },
        { z: z - 14, x: x, y: y - 22 },
        { z: z, x: x, y: y - 22 },
        { z: z, x: x, y: y - 30 },
        { z: z - 14, x: x, y: y - 30 },
      ]}
      stroke={4}
      color={'#e62'}
      fill
    />
  </Group>
);

export default Saw;
