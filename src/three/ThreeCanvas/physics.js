import * as CANNON from 'cannon'
import * as THREE from 'three'
import React, {useEffect, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useCannon } from '../../hooks/useCannon'
import { CannonContextProvider } from '../CannonContext';
import Plane from '../Plane'

function Box({ position }) {
  const [hovered, set] = useState(false)
  // Register box as a physics body with mass
  const ref = useCannon({ mass: 0.1 }, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)))
    body.position.set(...position)
  })
  return (
    <mesh ref={ref} castShadow receiveShadow onPointerOver={() => set(true)} onPointerOut={() => set(false)}>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" color={hovered ? 'lightpink' : 'white'} />
    </mesh>
  )
}

export default function App() {
  const [showPlane, set] = useState(true)
  // When React removes (unmounts) the upper plane after 5 sec, objects should drop ...
  // This may seem like magic, but as the plane unmounts it removes itself from cannon and that's that
  useEffect(() => void setTimeout(() => set(false), 5000), [])
  return (
    <Canvas
      style={{width: '100vw', height: '100vh'}}
      camera={{ position: [10, 10, 15] }}
      onCreated={({ gl }) => ((gl.shadowMap.enabled = true), (gl.shadowMap.type = THREE.PCFSoftShadowMap))}
    >
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
      <CannonContextProvider>
        <Plane position={[0, 0, -10]} />
        {showPlane && <Plane position={[0, 0, 0]} />}
        <Box position={[1, 0, 1]} />
        <Box position={[2, 1, 5]} />
        <Box position={[0, 0, 6]} />
        <Box position={[-1, 1, 8]} />
        <Box position={[-2, 2, 13]} />
        <Box position={[2, -1, 13]} />
        {!showPlane && <Box position={[0.5, 1.5, 20]} />}
      </CannonContextProvider>
    </Canvas>
  )
}