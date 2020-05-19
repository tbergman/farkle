import React from 'react';
import * as CANNON from 'cannon';
import { useCannon } from '../../hooks/useCannon';
import { groundMaterial } from '../materials';

type GroundProps = {
  position: [number, number, number],
  size: number
}

function Ground({position, size}: GroundProps) {
  // Register plane as a physics body with zero mass
  const {ref} = useCannon(
    {
      mass: 0,
      material: groundMaterial,
    },
    (body: CANNON.Body) => {
      body.addShape(new CANNON.Plane());
      body.position.set(...position);
    }
  );

  return (
    <mesh ref={ref} receiveShadow={true}>
      <planeBufferGeometry attach="geometry" args={[size, size]} />
      <meshPhongMaterial attach="material" color="#002f00" />
    </mesh>
  );
}
export default Ground;
