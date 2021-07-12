import { Rect, RoundedRect, Ellipse } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';
import { Translate } from './GfxRoot';

const CardPile: React.FC<Translate> = ({ translate: { x, y, z } }) => (
  <>
    <Rect
      width={12}
      height={20}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#DDD'}
      fill
      translate={{ z, x, y }}
    />
    <RoundedRect
      cornerRadius={1}
      width={10}
      height={18}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10), y: 0 }}
      color={'#C25'}
      fill
      translate={{ z, x, y }}
    />
    <Ellipse
      width={9}
      height={15}
      rotate={{ x: TAU / 4, z: -(TAU / 6) }}
      translate={{ z, x, y }}
      stroke={0}
      color={'#DDD'}
      fill
    />
    <Rect
      width={1}
      height={3}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#222'}
      rearFace={false}
      fill
      translate={{ z: z - 2, x, y }}
    />
    <Rect
      width={1}
      height={3}
      stroke={0}
      rotate={{ x: TAU / 4, z: -(TAU / 10) }}
      color={'#222'}
      rearFace={false}
      fill
      translate={{ z, x: x - 2, y }}
    />
    <Ellipse
      width={4}
      height={3}
      rotate={{ x: TAU / 4, z: -(TAU / 6) }}
      translate={{ z: z + 2, x: x + 2, y }}
      stroke={0}
      color={'#222'}
      fill
    />
  </>
);

export default CardPile;
