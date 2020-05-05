import * as THREE from 'three';
import React, { useState, Suspense, useContext } from 'react';
import { useLoader, useFrame, useCamera, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useCannon } from '../../hooks/useCannon';
import * as CANNON from 'cannon';
import { getDieValue } from './traverseDie';
import { CannonContext } from '../CannonContext';

const pi = Math.PI
const _scale = 0.85/2 // makes the die 1 unit cube

type dieProps = {
  id: number
  onValueSet: Function
}

const InternalDie3DComponent = ({id, onValueSet}: dieProps) => {
  const dieGltf = useLoader(GLTFLoader, 'assets/die.glb');
  const [dieGeom, setDieGeom] = useState<THREE.Group>();
  const {camera, raycaster} = useThree()
  const [isDragging, setIsDragging] = useState(false)

  if (!dieGeom) {
    setDieGeom(dieGltf.scene.clone(true));
  }

  const [value, setValue] = useState(0);
  const {ref, body} = useCannon(
    {
      id,
      mass: 500,
      position: new CANNON.Vec3(
        (id % 3) * _scale * 3 - 3,
        (id >= 3 ? _scale * 4 : _scale) + 3,
        1 * _scale
      ),
      velocity: new CANNON.Vec3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        8
      ),
      angularVelocity: new CANNON.Vec3(
        6 * pi * Math.random(),
        6 * pi * Math.random(),
        6 * pi * Math.random()
      ),
    },
    (body: CANNON.Body) => {
      body.addShape(new CANNON.Box(new CANNON.Vec3(_scale, _scale, _scale)));
    }
  );

  const getValue = (): number => {
    if (ref && ref.current) {
      const _x = parseFloat((ref.current.rotation.x / pi).toFixed(2));
      const _y = parseFloat((ref.current.rotation.y / pi).toFixed(2));
      const _z = parseFloat((ref.current.rotation.z / pi).toFixed(2));
      const val = getDieValue([_x, _y, _z]);
      console.log(`Die ${id} rolled ${val}`);
      return val;
    } else return 0;
  };

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

  const handleDrag = (e: THREE.Event) => {
    if (isDragging) {
      if (ref && ref.current) {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        const vector = new THREE.Vector3(mouseX, mouseY, 1);
        console.log(vector.unproject(camera))
        raycaster.set( camera.position, vector.sub( camera.position ).normalize())

        body.position.copy(new CANNON.Vec3(vector.x, vector.y, vector.z))
      }
    }
  }

  return (
    <>
      <primitive
        ref={ref}
        castShadow
        object={dieGeom}
        scale={[_scale, _scale, _scale]}
        onClick={(e: Event) => getValue()}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        onPointerMove={(e: THREE.Event) => handleDrag(e)}
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
