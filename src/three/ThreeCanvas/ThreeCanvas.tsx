/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import {Canvas, useThree } from 'react-three-fiber';
import Die3DComponent from '../Die3DComponent';
import Plane from '../Plane';
import { CannonContextProvider } from '../CannonContext';
import { DiceValueArray, DieValue } from '../../game/Die';
import { FarkleLogic } from '../../game/FarkleLogic';
import Box from '../Box'
import { State, Event, StateValue } from 'xstate';
import { gameContext, gameEvent } from '../../game/Farkle';

type FarkleThreeCanvasProps = {
  gameStateValue: StateValue,
  frozenDice: Array<boolean>,
  sendGameEvent: Function,
}

const _dieIds = [0,1,2,3,4,5]

const FarkleThreeCanvas = ({gameStateValue, frozenDice, sendGameEvent} : FarkleThreeCanvasProps) => {

  const [dieValues, setDieValues] = useState<DiceValueArray>([0,0,0,0,0,0]);

  const setValueForDie = (id:number, newVal: DieValue) => {
    const _vals = [...dieValues as Array<DieValue>]
    _vals[id] = newVal
    setDieValues(_vals)
  }

  useEffect(() => {
    if(dieValues.every(v => v !== 0)) {
      console.log('All set', dieValues)
    }
  }, [dieValues])

  const handleFreeze = (id: number) => {
    console.log('freezing', id)
    sendGameEvent('FREEZE', {dieId: id})
  }

  return (
    <>
      <Canvas
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          zIndex: -1,
        }}
        camera={{
          position: [0, -4, 12],
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
        {/* <axesHelper /> */}
        {/* <arrowHelper ref={arrowHelperRef} /> */}
        {/* <planeHelper plane={new THREE.Plane(new THREE.Vector3(0, 0, 1))} size={10} /> */}
        {/* <gridHelper /> */}
        <Box position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[5, 5, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[5, -5, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[-5, 5, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[-5, -5, 0]} scale={[0.1, 0.1, 0.1]} />

        <CannonContextProvider>
          <Plane position={[0, 0, 0]} />
          <Die3DComponent
            key={0}
            id={0}
            isFrozen={frozenDice[0]}
            onFreeze={(e: THREE.Event) => handleFreeze(0)}
            onValueSet={(v: DieValue) => setValueForDie(0, v)}
          />
          <Die3DComponent
            key={1}
            id={1}
            isFrozen={frozenDice[1]}
            onFreeze={(e: THREE.Event) => handleFreeze(1)}
            onValueSet={(v: DieValue) => setValueForDie(1, v)}
          />
          <Die3DComponent
            key={2}
            id={2}
            isFrozen={frozenDice[2]}
            onFreeze={(e: THREE.Event) => handleFreeze(2)}
            onValueSet={(v: DieValue) => setValueForDie(2, v)}
          />
          <Die3DComponent
            key={3}
            id={3}
            isFrozen={frozenDice[3]}
            onFreeze={(e: THREE.Event) => handleFreeze(3)}
            onValueSet={(v: DieValue) => setValueForDie(3, v)}
          />
          <Die3DComponent
            key={4}
            id={4}
            isFrozen={frozenDice[4]}
            onFreeze={(e: THREE.Event) => handleFreeze(4)}
            onValueSet={(v: DieValue) => setValueForDie(4, v)}
          />
          <Die3DComponent
            key={5}
            id={5}
            isFrozen={frozenDice[5]}
            onFreeze={(e: THREE.Event) => handleFreeze(5)}
            onValueSet={(v: DieValue) => setValueForDie(5, v)}
          />
        </CannonContextProvider>
      </Canvas>
    </>
  );
}


export default FarkleThreeCanvas;
