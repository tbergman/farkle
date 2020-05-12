
import * as THREE from 'three';
import React, { useState, Suspense, useEffect, useRef } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useCannon } from '../../hooks/useCannon';
import * as CANNON from 'cannon';
import { getDieValue } from './getDieValue';
import { StateValue } from 'xstate';
import { hasSettled } from './hasSettled';
import { DieValue } from '../../game/Die';
import { throwConditions, initialConditions } from './initialConditions';
import { usePrevious } from '../../hooks/usePrevious';
import { useRenderCount } from '../../hooks/useRenderCount';
import { useTraceUpdate } from '../../hooks/useTraceUpdate';

const _scale = 0.85/2 // makes the die 1 unit cube
const mass = 42

type dieProps = {
  id: number,
  value: number,
  isFrozen: boolean,
  turnState: StateValue,
  onFreeze: Function,
  setValue: Function
}

const InternalDie3DComponent = ({
  id, 
  isFrozen,
  value,
  turnState, 
  setValue, 
  onFreeze,
}: dieProps) => {
  const dieGltf = useLoader(GLTFLoader, 'assets/die.glb');
  const [dieGeom, setDieGeom] = useState<THREE.Group>();
  const [material, setMaterial] = useState<THREE.MeshStandardMaterial>();
  // const [value, setValue] = useState<DieValue>(0);
  const prevTurnState = usePrevious(turnState);

  const isNewRoll = useRef(false)

  // useTraceUpdate({id, isFrozen, turnState, onFreeze, onValueSet});
  // useRenderCount(`die ${id}`)

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
      quaternion: initialConditions(id).quaternion,
      velocity: initialConditions(id).velocity,
      angularVelocity: initialConditions(id).angularVelocity,
    },
    (body: CANNON.Body) => {
      body.addShape(new CANNON.Box(new CANNON.Vec3(_scale, _scale, _scale)));
    }
  );
  const bodyRef = useRef(body)

  // When turnState changes, roll again
  useEffect(() => {
    if (prevTurnState !== 'rolling' && turnState === 'rolling' && !isFrozen) {
      console.log('Rolling');
      // roll dice
      isNewRoll.current = true;
      bodyRef.current.position = throwConditions(id).position;
      bodyRef.current.quaternion = throwConditions(id).quaternion;
      bodyRef.current.velocity = throwConditions(id).velocity;
      bodyRef.current.angularVelocity = throwConditions(id).angularVelocity;
    } else if (turnState === 'start') {
      bodyRef.current.position = initialConditions(id).position;
    }
  }, [turnState, prevTurnState, isFrozen, id, setValue]);


  // When the die has settled, 
  // set the value
  useFrame(() => {
    if (
      !!ref.current && 
      isNewRoll.current &&
      turnState === 'rolling' &&
      hasSettled(bodyRef.current)
    ) {
      isNewRoll.current = false;
      const val = getValue();
      // console.log(`Die ${id} settled on ${val}`);
      setValue(val);
    }
  });

  // Change the material when frozen
  useEffect(() => {
    if (material) {
      if (isFrozen) {
        material.emissive = new THREE.Color(0x0088ff);
        bodyRef.current.mass = 100 * mass
      } else {
        material.emissive = new THREE.Color(0x000000);
        bodyRef.current.mass = mass
      }
    }
  }, [bodyRef.current.mass, isFrozen, material]);

  const getValue = (): DieValue => {
    if (ref && ref.current) {
      const val = getDieValue([ref.current.rotation.x, ref.current.rotation.y, ref.current.rotation.z]);
      return val;
    } else return 0;
  };

  const handleClick = (e: THREE.Event) => {
    // console.log(value, getValue(), value === getValue())
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

export default Die3DComponent
