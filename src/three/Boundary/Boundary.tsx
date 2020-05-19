import React, { useState, useEffect, useReducer } from 'react';
import * as CANNON from 'cannon';
import * as THREE from 'three';
import { useCannon } from '../../hooks/useCannon';
import { groundMaterial } from '../materials';
import { useThree } from 'react-three-fiber';
import { ConvertVector } from '../../util/vectorConvert';
import Box from '../Box';
import { useGroundCoords } from '../../hooks/useGroundCoords';
//import { Test } from './Boundary.styles';

type TSide = 'top' | 'right' | 'bottom' | 'left' 

type BoundaryPlaneProps = {
  coords: [THREE.Vector3, THREE.Vector3]
}
const BoundaryPlane = ({coords}: BoundaryPlaneProps) => {

  const [size, setSize] = useState(0)

  const {ref, body} = useCannon(
    {
      mass: 0,
      material: groundMaterial
    },
    (body: CANNON.Body) => {
      body.addShape(new CANNON.Plane());
    }
  );

  // setRotation
  useEffect(() => {
    const getRotation = () => {
      const a = coords[0];
      const b = coords[1];
      const y = (b.y - a.y);
      const x = (b.x - a.x)
      const tyx = y / x;
      let angle = 0;
      // ASSUME STANDARD POSITION
      if (x >= 0) {
        angle = Math.PI + Math.atan(tyx);
      } else if (x <= 0) {
        angle = Math.atan(tyx);
      }
      return -angle // angles are applied backwards
    };
    body.quaternion.setFromEuler(-Math.PI / 2, getRotation(), 0);
  }, [coords, body.quaternion])

  // setLength
  useEffect(() => {
    const a = coords[0];
    const b = coords[1];
    const len = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    setSize(len)
  }, [coords])

  // setDistance
  useEffect(() => {
    const a = coords[0];
    const b = coords[1];
    const mpx = Math.min(a.x, b.x) + Math.abs((a.x - b.x))/2
    const mpy = Math.min(a.y, b.y) + Math.abs(a.y - b.y) / 2;
    const mp = new THREE.Vector3(mpx, mpy, 0)
    body.position.set(...ConvertVector.toArray(mp));
  }, [body.position, coords])


  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[size + 1, 1]} />
      <meshBasicMaterial attach="material" opacity={0} transparent={true} />
    </mesh>
  );
};

// ------------------------------------------
const Boundary = () => {

  const tl = useGroundCoords(-1, 1);
  const tr = useGroundCoords(1, 1);
  const br = useGroundCoords(1, -1);
  const bl = useGroundCoords(-1, -1);

  return (
    <>
      <BoundaryPlane coords={[tl, tr]}/>
      <BoundaryPlane coords={[tr, br]}/>
      <BoundaryPlane coords={[br, bl]}/>
      <BoundaryPlane coords={[bl, tl]}/>
    </>
  );  
}
export default Boundary;
