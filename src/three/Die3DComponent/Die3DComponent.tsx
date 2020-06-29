
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
import { initialConditions } from './initialConditions';
import { usePrevious } from '../../hooks/usePrevious';
import { DIE_MASS, DIE_SIZE, FPS, EULER_ORDER } from '../../constants';
import { dieMaterial, frozenMaterial } from '../materials';
import { useCameraToGroundCoords } from '../../hooks/useCameraToGroundCoords';
import { Vec3Array, V3 } from '../../util/vectorConvert';
import { quat2Euler } from '../../util/quat2Euler';
import { ThrowCondition } from '../../game/throwConditions';

const max_seconds_to_settle = 2;

type dieProps = {
  id: number,
  isFrozen: boolean,
  turnState: StateValue,
  onFreeze: Function,
  setValue: Function,
  throwConditions?: ThrowCondition
  position?: CANNON.Vec3 | THREE.Vector3,
  rotation?: Vec3Array,
}

const InternalDie3DComponent = ({
  id, 
  isFrozen,
  turnState, 
  setValue, 
  onFreeze,
  throwConditions,
  position,
  rotation
}: dieProps) => {
  const dieGltf = useLoader(GLTFLoader, 'assets/die.glb');
  const [dieGeom, setDieGeom] = useState<THREE.Group>();
  const [material, setMaterial] = useState<THREE.MeshStandardMaterial>();
  const [framesSinceRoll, setFramesSinceRoll] = useState(0);
  const prevTurnState = usePrevious(turnState);
  const freezePosition = useCameraToGroundCoords( -5/8 + (2/8 * id), 0.7);
  const isNewRoll = useRef(false)

  // set the die geometry
  if (!dieGeom) { setDieGeom(dieGltf.scene.clone(true));}
  useEffect(() => {
    dieGeom?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = (obj.material as THREE.MeshStandardMaterial).clone();
        setMaterial(obj.material as THREE.MeshStandardMaterial);
      }
    });
  }, [dieGeom]);

  // Initialize physics
  const {ref, body} = useCannon(
    {
      id,
      mass: DIE_MASS,
      material: dieMaterial,
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


  // Set initial position
  useEffect(() => {
    if (!!position) body.position = V3.toCannon(position)
  }, [body.position, position])

  // Set initial rotation
  useEffect(() => {
    if (!!rotation) body.quaternion.setFromEuler(rotation[0], rotation[1], rotation[2], EULER_ORDER)
  }, [body.quaternion, rotation])

  // When turnState changes, roll again
  useEffect(() => {
    if (prevTurnState !== 'rolling' && turnState === 'rolling' && !isFrozen) {
      console.log('Rolling');
      isNewRoll.current = true;
      if (material) material.visible = true
      if (throwConditions) {
        console.log(throwConditions)
        bodyRef.current.quaternion.setFromEuler(...throwConditions.rotation);
        bodyRef.current.position = V3.toCannon(throwConditions.position);
        bodyRef.current.velocity = V3.toCannon(throwConditions.velocity);
        bodyRef.current.angularVelocity = V3.toCannon(throwConditions.angularVelocity);
      }
      setFramesSinceRoll(0)
    } else if (turnState === 'start') {
      bodyRef.current.position = initialConditions(id).position;
      if (material) material.visible = false
    }
  }, [turnState, prevTurnState, isFrozen, id, setValue, material, throwConditions]);


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
        bodyRef.current.material = frozenMaterial
        bodyRef.current.position = V3.toCannon(freezePosition);
      } else {
        material.emissive = new THREE.Color(0x000000);
        bodyRef.current.material = dieMaterial
      }
    }
  }, [bodyRef.current.mass, freezePosition, id, isFrozen, material]);

  const getValue = (): DieValue => {
    if (ref && ref.current) {
      const euler = quat2Euler(body.quaternion)
      const val = getDieValue([euler.x, euler.y, euler.z]);
      return val;
    } else return 0;
  };

  const handleClick = (e: THREE.Event) => {
    console.log(`value: ${getValue()}`)
    if (!hasSettled(bodyRef.current)) console.log(bodyRef.current)
    onFreeze(e)
  };

  return (
    <>
      {
        <primitive
          ref={ref}
          castShadow
          object={dieGeom}
          scale={[DIE_SIZE, DIE_SIZE, DIE_SIZE]}
          onPointerUp={(e:Event) => handleClick(e)}
        ></primitive>
      }
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
