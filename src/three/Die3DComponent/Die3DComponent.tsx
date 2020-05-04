import * as THREE from 'three';
import React, { useState, Suspense, useContext } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useCannon } from '../../hooks/useCannon';
import * as CANNON from 'cannon';
import { getDieValue } from './traverseDie';
import { CannonContext } from '../CannonContext';

const pi = Math.PI
const _scale = 0.85/2 // makes the die 1 unit cube

type dieProps = {
  id: 0 | 1 | 2 | 3 | 4 | 5,
}

const InternalDie3DComponent = ({id}: dieProps) => {
  const dieGltf = useLoader(GLTFLoader, 'assets/die.glb');
  const [dieGeom, setDieGeom] = useState<THREE.Group>();
  if (!dieGeom) {setDieGeom(dieGltf.scene.clone(true));}
  
  const [value, setValue] = useState(0)
  const cannonContext = useContext(CannonContext); // Get cannon world object


  const ref = useCannon({mass: 50, id}, (body: CANNON.Body) => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(_scale, _scale, _scale)));
    // set initial state
    body.position.set(
      (id % 3) * _scale * 4,
      id >= 3 ? _scale * 10 : _scale,
      2 * _scale
    );
    body.velocity.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      5
    )
    body.angularVelocity.set(
      6 * pi * Math.random(),
      6 * pi * Math.random(),
      6 * pi * Math.random(),
    );
  });

  const getValue = ():number => {
    if (ref && ref.current) {
      const _x = parseFloat((ref.current.rotation.x / pi).toFixed(2));
      const _y = parseFloat((ref.current.rotation.y / pi).toFixed(2));
      const _z = parseFloat((ref.current.rotation.z / pi).toFixed(2));
      const val = getDieValue([_x, _y, _z]);
      console.log(`Die ${id} rolled ${val}`);
      return val;
    } else return 0
  };

  // useFrame(() => {
  //   if (
  //     Math.abs(Math.round(cannonContext.bodies[id].velocity.x)) === 0 &&
  //     Math.abs(Math.round(cannonContext.bodies[id].velocity.y)) === 0 &&
  //     Math.abs(Math.round(cannonContext.bodies[id].velocity.z)) === 0 &&
  //     Math.abs(Math.round(cannonContext.bodies[id].angularVelocity.x)) === 0 &&
  //     Math.abs(Math.round(cannonContext.bodies[id].angularVelocity.y)) === 0 &&
  //     Math.abs(Math.round(cannonContext.bodies[id].angularVelocity.z)) === 0 &&
  //     !isNaN(cannonContext.bodies[id].inertia.x) &&
  //     !isNaN(cannonContext.bodies[id].inertia.y) &&
  //     !isNaN(cannonContext.bodies[id].inertia.z)
  //   ) {
  //     if (value === 0) {
  //       setValue(getValue());
  //     }
  //   }
  // })

  return (
    <>
      <primitive
        ref={ref}
        castShadow
        object={dieGeom}
        scale={[_scale, _scale, _scale]}
        onClick={(e: Event) => getValue()}
      ></primitive>
    </>
  );
};

const Die3DComponent = (props: dieProps ) => {
  return (
    <Suspense fallback={null}>
      <InternalDie3DComponent {...props}/>
    </Suspense>
  )
}

export default Die3DComponent;
