import { Shape } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './GfxRoot';

const Fork: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <Shape
    rotate={{ z: TAU / 8 }}
    path={[
      { z, x: x + 14, y: y + -20 },
      { z, x: x + 12, y: y + -18 },
      { z, x: x + 13, y: y + 3 },
      { z, x: x + 11, y: y + 4 },
      { z, x: x + 10, y: y + 6 },
      { z, x: x + 11, y: y + 15 },
      { z, x: x + 12, y: y + 4 },
      { z, x: x + 14, y: y + 15 },
      { z, x: x + 16, y: y + 4 },
      { z, x: x + 16.7, y: y + 12.7 },
      { z, x: x + 17.5, y: y + 12 },
      { z, x: x + 18, y: y + 6 },
      { z, x: x + 17, y: y + 4 },
      { z, x: x + 15, y: y + 3 },
      { z, x: x + 16, y: y + -18 },
    ]}
    stroke={0.8}
    color={'#888'}
    fill
  />
);

export default Fork;
