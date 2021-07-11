import { Cylinder, Cone, Group, Shape, useRender, Anchor } from 'react-zdog';
import React, { useRef } from 'react';
import { Translate } from './GfxRoot';
import { TAU } from 'zdog';
import { useSpring, animated } from '@react-spring/zdog';

const Candle: React.FC<Translate> = ({ translate: { x, y, z } }) => {
  const spr = useSpring({
    loop: true,
    delay: 0,
    config: { friction: 2 },
    from: {
      scale: 0.9,
      y: 0,
    },
    to: [
      {
        scale: 1,
        y: 3,
      },
      {
        scale: 0.9,
        y: 0,
      },
    ],
  });

  const AnimatedAnchor = animated(Anchor);

  const anhorRef = useRef<any>();

  useRender(() => {
    if (anhorRef && anhorRef.current) {
      anhorRef.current.translate = { x, z, y: y + spr.y.get() };
    }
  });

  return (
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

      <AnimatedAnchor ref={anhorRef} scale={spr.scale}>
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
      </AnimatedAnchor>
    </Group>
  );
};

export default Candle;
