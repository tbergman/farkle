import React from 'react';
import * as CANNON from 'cannon';
import { useCannon } from '../../hooks/useCannon';
//import { Test } from './Plane.styles';

type PlaneProps = {
  position: [number, number, number],
  size: number
}

function Plane({position, size}: PlaneProps) {
  // Register plane as a physics body with zero mass
  const {ref} = useCannon({mass: 0}, (body:CANNON.Body) => {
    body.addShape(new CANNON.Plane());
    body.position.set(...position);
  });

  return (
    <mesh 
      ref={ref} 
      receiveShadow
    >
      <planeBufferGeometry attach="geometry" args={[size, size]} />
      <meshPhongMaterial attach="material" color="#002f00" />
    </mesh>
  );
}
export default Plane;
