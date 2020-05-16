
import * as THREE from 'three';
import React, { useState, Suspense, useEffect, useRef } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useCannon } from '../../hooks/useCannon';
import * as CANNON from 'cannon';
import { getDieValue } from './getDieValue';
import { StateValue } from 'xstate';
import { hasSettled, forceSettle } from './hasSettled';
import { DieValue } from '../../game/Die';
import { throwConditions, initialConditions } from './initialConditions';
import { usePrevious } from '../../hooks/usePrevious';
import { DIE_MASS, DIE_SIZE, FPS } from '../constants';

const max_seconds_to_settle = 1;

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
  const [framesSinceRoll, setFramesSinceRoll] = useState(0);
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
      mass: DIE_MASS,
      position: initialConditions(id).position,
      quaternion: initialConditions(id).quaternion,
      velocity: initialConditions(id).velocity,
      angularVelocity: initialConditions(id).angularVelocity,
    },
    (body: CANNON.Body) => {
      body.addShape(new CANNON.Box(new CANNON.Vec3(DIE_SIZE, DIE_SIZE, DIE_SIZE)));
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
      setFramesSinceRoll(0)
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
      turnState === 'rolling'
    ) {
      if (hasSettled(bodyRef.current)) {
        isNewRoll.current = false;
        const val = getValue();
        setValue(val);
      } else {
        setFramesSinceRoll(framesSinceRoll + 1)
        if (framesSinceRoll / FPS >= max_seconds_to_settle) {
          // force the die to settle
          bodyRef.current = forceSettle(bodyRef.current)
          isNewRoll.current = false;
          const val = getValue();
          setValue(val);
        }
      }
    }
  });

  // Change the material when frozen
  useEffect(() => {
    if (material) {
      if (isFrozen) {
        material.emissive = new THREE.Color(0x0088ff);
        // bodyRef.current.mass = 100 * DIE_MASS
        debugger

      } else {
        material.emissive = new THREE.Color(0x000000);
        // bodyRef.current.mass = DIE_MASS
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
    if (!hasSettled(bodyRef.current)) console.log(bodyRef.current)
    onFreeze(e)
  };

  return (
    <>
      {/* <Box position={quaternion} scale={[0.1, 0.1, 0.1]} /> */}
      <primitive
        ref={ref}
        castShadow
        object={dieGeom}
        scale={[DIE_SIZE, DIE_SIZE, DIE_SIZE]}
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
