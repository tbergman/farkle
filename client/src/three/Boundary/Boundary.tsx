import React, { useState, useEffect } from 'react';
import * as CANNON from 'cannon';
import * as THREE from 'three';
import { useCannon } from '../../hooks/useCannon';
import { groundMaterial } from '../materials';
import { V3 } from '../../util/vectorConvert';
import { useCameraToGroundCoords } from '../../hooks/useCameraToGroundCoords';

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
    body.position.set(...V3.toArray(mp));
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

  const tl = useCameraToGroundCoords(-1, 1);
  const tr = useCameraToGroundCoords(1, 1);
  const br = useCameraToGroundCoords(1, -0.7);
  const bl = useCameraToGroundCoords(-1, -0.7);

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
