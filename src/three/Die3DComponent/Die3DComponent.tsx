import * as THREE from 'three';
import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useCannon } from '../../hooks/useCannon';
import * as CANNON from 'cannon';
import { getDieValue } from './traverseDie';

const pi = Math.PI
const _scale = 0.85/2 // makes the die 1 unit cube


type dieProps = {
  id: number,
  isFrozen: boolean,
  onFreeze: Function,
  onValueSet: Function
}

const InternalDie3DComponent = ({id, onValueSet, isFrozen, onFreeze}: dieProps) => {
  const dieGltf = useLoader(GLTFLoader, 'assets/die.glb');
  const [dieGeom, setDieGeom] = useState<THREE.Group>();
  const [material, setMaterial] = useState<THREE.MeshStandardMaterial>();
  const [value, setValue] = useState(0);
  // const {gl ,camera, raycaster} = useThree()
  // const [isDragging, setIsDragging] = useState(false)

  if (!dieGeom) {
    setDieGeom(dieGltf.scene.clone(true));
  }
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
      mass: 50,
      position: new CANNON.Vec3(
        ((id % 3) - 1) * _scale * 3,
        (id >= 3 ? _scale * 4 : _scale) - 2 * _scale,
        2 * _scale
      ),
      velocity: new CANNON.Vec3(
        (Math.random() - 0.5) * 2,
        Math.random() * (id >= 3 ? 2 : -2),
        8
      ),
      angularVelocity: new CANNON.Vec3(
        4 * pi * Math.random(),
        4 * pi * Math.random(),
        4 * pi * Math.random()
      ),
    },
    (body: CANNON.Body) => {
      body.addShape(new CANNON.Box(new CANNON.Vec3(_scale, _scale, _scale)));
    }
  );

  // When the die has settled, set the value
  useFrame(() => {
    if (
      Math.abs(body.velocity.x).toFixed(2) === '0.00' &&
      Math.abs(body.velocity.y).toFixed(2) === '0.00' &&
      Math.abs(body.velocity.z).toFixed(2) === '0.00' &&
      Math.abs(body.angularVelocity.x).toFixed(2) === '0.00' &&
      Math.abs(body.angularVelocity.y).toFixed(2) === '0.00' &&
      Math.abs(body.angularVelocity.z).toFixed(2) === '0.00' &&
      !isNaN(body.inertia.x) &&
      !isNaN(body.inertia.y) &&
      !isNaN(body.inertia.z)
    ) {
      if (value === 0) {
        const val = getValue();
        setValue(val);
        onValueSet(val);
      }
    }
  });

  useEffect(() => {
    if (material) {
      if (isFrozen) {
        material.emissive = new THREE.Color(0x0088ff);
      } else {
        material.emissive = new THREE.Color(0x000000);
      }
    }
  }, [isFrozen, material]);

  const getValue = (): number => {
    if (ref && ref.current) {
      const val = getDieValue([
        parseFloat((ref.current.rotation.x / pi).toFixed(2)),
        parseFloat((ref.current.rotation.y / pi).toFixed(2)),
        parseFloat((ref.current.rotation.z / pi).toFixed(2)),
      ]);
      console.log(`Die ${id} rolled ${val}`);
      return val;
    } else return 0;
  };

  const handleClick = (e: THREE.Event) => {
    onFreeze(e)
  };

  // const handleDrag = (e: THREE.Event) => {
  // if (isDragging) {
  //   if (ref && ref.current) {
  //     const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  //     const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  //     // console.log(mouseX, mouseY)
  //     let vector = new THREE.Vector3(
  //       mouseX,
  //       mouseY,
  //       0.98 // magic number
  //     );
  //     vector.unproject(camera)
  //     body.position.set(
  //       vector.x,
  //       vector.y,
  //       _scale * 2
  //     )
  //   }
  // }
  // }

  return (
    <>
      {/* <arrowHelper
        ref={arrowHelperRef}
      /> */}
      <primitive
        ref={ref}
        castShadow
        object={dieGeom}
        scale={[_scale, _scale, _scale]}
        onClick={(e: Event) => handleClick(e)}
        // onPointerDown={() => setIsDragging(true)}
        // onPointerUp={() => setIsDragging(false)}
        // onPointerLeave={() => setIsDragging(false)}
        // onPointerMove={(e: THREE.Event) => handleDrag(e)}
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
