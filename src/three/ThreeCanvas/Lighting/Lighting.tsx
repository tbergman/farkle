import React from 'react';
import { SPOTLIGHT_HEIGHT, SPOTLIGHT_RADIUS } from '../../../constants';
import { range } from '../../../util/range';

type LightingProps = {
  countSpotlights: number
}

const Lighting = ({countSpotlights}: LightingProps) => {
  const angle = 2*Math.PI / countSpotlights

  return (
    <>
      <ambientLight intensity={0.5} />

      {range(countSpotlights).map((_, i) => {
        return ( 
          <spotLight
            key={i}
            intensity={0.8/countSpotlights}
            position={[
              SPOTLIGHT_RADIUS * Math.sin(i * angle), 
              SPOTLIGHT_RADIUS * Math.cos(i * angle), 
              SPOTLIGHT_HEIGHT]}
            angle={0.15}
            penumbra={0.05}
            castShadow
          />
        )

      })}
    </>
  );
};

export default Lighting;
