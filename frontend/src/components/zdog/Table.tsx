import { Cylinder, Ellipse } from 'react-zdog';
import React from 'react';
import { TAU } from 'zdog';

const Table: React.FC = () => (
  <>
    <Cylinder
      diameter={200}
      length={10}
      rotate={{ x: -(TAU / 4) }}
      stroke={false}
      color={'#C25'}
      frontFace={'#636'}
      backface={'#EA0'}
    />

    <Ellipse diameter={182} rotate={{ x: -(TAU / 4) }} translate={{ y: -5 }} stroke={0} color={'#164'} fill />
  </>
);

export default Table;
