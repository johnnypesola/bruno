import { Shape, Group } from 'react-zdog';
import { TAU } from 'zdog';
import React from 'react';
import { Translate } from './GfxRoot';

const SawBottom: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Group rotate={{ y: TAU / 8 }}>
    <Shape
      path={[
        { z: z + 6, x: x, y: y + 5 + 20 },
        { z: z + 3, x, y: y + 5 + 17 },
        { z: z + 6, x, y: y + 5 + 15 },
        { z: z + 3, x, y: y + 5 + 12 },
        { z: z + 6, x, y: y + 5 + 9 },
        { z: z + 3, x, y: y + 5 + 6 },
        { z: z + 6, x, y: y + 5 + 3 },
        { z: z - 13, x: x, y: y + 5 + 3 },
        { z: z - 12, x: x, y: y + 5 + 20 },
      ]}
      stroke={0.8}
      color={'#622'}
      fill
    />
  </Group>
);

export default SawBottom;
