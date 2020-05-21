import React from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import Camera from '../../three/ThreeCanvas/Camera';
import OrbitControlsComponent from '../../three/ThreeCanvas/OrbitControls';
import { CannonContextProvider } from '../../three/CannonContext';
import Ground from '../../three/Ground';
import { GROUND_SIZE } from '../../three/constants';
import '../../style/global.scss'
import DiceGrid from './DiceGrid';

const DiceValueTester = () => {
  return (
    <>
    <Canvas 
      style={{width: '100vw', height: '100vh',}}
      onCreated={({ gl }) => (
        (gl.shadowMap.enabled = true) as any,
        (gl.shadowMap.type = THREE.PCFSoftShadowMap) as any
      )}
    >
      <Camera position={[0,0,5]} />
      <OrbitControlsComponent />
      <ambientLight intensity={1} />


      <CannonContextProvider>
        <Ground position={[0, 0, -0]} size={GROUND_SIZE} />
        <DiceGrid />
      </CannonContextProvider>

    </Canvas>
    </>
  )
}

export default DiceValueTester;
