
import * as THREE from 'three';
import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useCannon } from '../../hooks/useCannon';
import * as CANNON from 'cannon';
import { getDieValue } from './getDieValue';
import { State, StateValue } from 'xstate';
import { hasSettled } from './hasSettled';
import { DieValue } from '../../game/Die';
import { throwConditions, initialConditions } from './initialConditions';
import Line from '../Line';
import Box from '../Box';
import { round } from '../../util/round';

const pi = Math.PI
const _scale = 0.85/2 // makes the die 1 unit cube
const mass = 50

type dieProps = {
  id: number,
  isFrozen: boolean,
  turnState: StateValue,
  onFreeze: Function,
  onValueSet: Function
}

const InternalDie3DComponent = ({
  id, 
  isFrozen,
  turnState, 
  onFreeze,
  onValueSet, 
}: dieProps) => {
  const dieGltf = useLoader(GLTFLoader, 'assets/die.glb');
  const [dieGeom, setDieGeom] = useState<THREE.Group>();
  const [material, setMaterial] = useState<THREE.MeshStandardMaterial>();
  const [value, setValue] = useState<DieValue | null>(null);

  if (!dieGeom) { setDieGeom(dieGltf.scene.clone(true));}

  useEffect(() => {
    dieGeom?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = (obj.material as THREE.MeshStandardMaterial).clone();
        setMaterial(obj.material as THREE.MeshStandardMaterial);
      }
    });
  }, [dieGeom]);

  const {ref, body} = useCannon(
    {
      id,
      mass,
      position: initialConditions(id).position,
      velocity: initialConditions(id).velocity,
      angularVelocity: initialConditions(id).angularVelocity,
      quaternion: initialConditions(id).quaternion
    },
    (body: CANNON.Body) => {
      body.addShape(new CANNON.Box(new CANNON.Vec3(_scale, _scale, _scale)));
    }
  );

  // Watch TurnState
  useEffect(() => {
    if (turnState === 'rolling' && !isFrozen) {
      // roll dice
      setValue(null)
      onValueSet(0);
      body.position = throwConditions(id).position;
      body.velocity = throwConditions(id).velocity;
      body.angularVelocity = throwConditions(id).angularVelocity;
    } else if (turnState === 'start') {
      body.position = initialConditions(id).position;
    }
  }, [turnState, isFrozen])

  // When the die has settled, set the value
  useFrame(() => {
    if ( ref.current && hasSettled(body, ref.current)) {
      if (turnState === 'rolling' && value === null) {
        const val = getValue();
        console.log(`Die ${id} settled on ${val}`)
        setValue(val);
        onValueSet(val);
      } 
    }
  });

  // Change the material when frozen
  useEffect(() => {
    if (material) {
      if (isFrozen) {
        material.emissive = new THREE.Color(0x0088ff);
        body.mass = 100 * mass
      } else {
        material.emissive = new THREE.Color(0x000000);
        body.mass = mass
      }
    }
  }, [body.mass, isFrozen, material]);

  const getValue = (): DieValue => {
    if (ref && ref.current) {
      const val = getDieValue([ref.current.rotation.x, ref.current.rotation.y, ref.current.rotation.z]);
      return val;
    } else return 0;
  };

  const handleClick = (e: THREE.Event) => {
    console.log(ref.current?.rotation, getValue())
    onFreeze(e)
  };

  return (
    <>
      {/* <Box position={quaternion} scale={[0.1, 0.1, 0.1]} /> */}
      <primitive
        ref={ref}
        castShadow
        object={dieGeom}
        scale={[_scale, _scale, _scale]}
        onClick={(e: Event) => handleClick(e)}
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
