/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import {Canvas, useFrame} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Die3DComponent from '../Die3DComponent';
// import App from './physics'
import Plane from '../Plane';
import { CannonContextProvider } from '../CannonContext';
import Box from '../Box';

const ThreeCanvas = () => {
  console.log('ThreeCanvas')
  return (
    <Canvas
      style={{width: '100vw', height: '100vh'}}
      camera={{
        position: [0, -5, 10],
      }}
      onCreated={({gl}) => (
        (gl.shadowMap.enabled = true) as any,
        (gl.shadowMap.type = THREE.PCFSoftShadowMap) as any
      )}
    >
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.9}
        position={[30, 30, 50]}
        angle={0.2}
        penumbra={1}
        castShadow
      />
      {/* <pointLight position={[10, 10, 10]}/> */}
      {/* <axesHelper />
      <planeHelper 
        plane={new THREE.Plane(new THREE.Vector3(0,0,1))}
        size={10}
      /> */}
      <CannonContextProvider>
        <Plane position={[0, 0, 0]} />
        <Die3DComponent id={0} />
        <Die3DComponent id={1} />
        <Die3DComponent id={2} />
        <Die3DComponent id={3} />
        <Die3DComponent id={4} />
        <Die3DComponent id={5} />
      </CannonContextProvider>
    </Canvas>
    // <App/>
  );
}


export default ThreeCanvas;
