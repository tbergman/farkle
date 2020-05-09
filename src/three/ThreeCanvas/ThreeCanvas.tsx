/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import {Canvas, useThree, ReactThreeFiber, useFrame } from 'react-three-fiber';
import Die3DComponent from '../Die3DComponent';
import Plane from '../Plane';
import { CannonContextProvider } from '../CannonContext';
import { DiceValueArray, DieValue } from '../../game/Die';
import { FarkleLogic } from '../../game/FarkleLogic';
import Box from '../Box'
import { State, Event, StateValue } from 'xstate';
import { gameContext, gameEvent } from '../../game/Farkle';
import { usePrevious } from '../../hooks/usePrevious';
import OrbitControlsComponent from './OrbitControls';
import Line from '../Line';

type FarkleThreeCanvasProps = {
  gameState: State<gameContext, gameEvent, any, any>,
  frozenDice: Array<boolean>,
  sendGameEvent: Function,
}

const _dieIds = [0,1,2,3,4,5]

const FarkleThreeCanvas = ({
  gameState,
  frozenDice,
  sendGameEvent,
}: FarkleThreeCanvasProps) => {
  
  const [dieValues, setDieValues] = useState<DiceValueArray>([0,0,0,0,0,0,]);
  const prevGameState = usePrevious(gameState)

  // Send all dice values to Game when they're settled
  useEffect(() => {
    const turnValue = Object.values(gameState.value)[0];
    if (turnValue === 'rolling') {
      if (dieValues.every((v) => v !== 0)) {
        console.log('Sending SET_DICE', dieValues)
        sendGameEvent('SET_DICE', {values: dieValues});
      }
    }
  }, [dieValues]);


  const setValueForDie = (id: number, newVal: DieValue) => {
    const _vals = [...(dieValues as Array<DieValue>)];
    _vals[id] = newVal;
    console.log(`Setting value of ${id} to ${newVal}`);
    setDieValues(_vals);
  };


  // Send the "FREEZE" event to the Game
  const handleFreeze = (id: number) => {
    sendGameEvent('FREEZE', {dieId: id});
  };

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
        <OrbitControlsComponent />
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.9}
          position={[30, 30, 50]}
          angle={0.2}
          penumbra={1}
          castShadow
        />

        {/* <pointLight position={[10, 10, 10]}/> */}
        <axesHelper />
        {/* <arrowHelper ref={arrowHelperRef} /> */}
        {/* <planeHelper plane={new THREE.Plane(new THREE.Vector3(0, 0, 1))} size={10} /> */}
        <gridHelper />

        <Box position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[5, 5, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[5, -5, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[-5, 5, 0]} scale={[0.1, 0.1, 0.1]} />
        <Box position={[-5, -5, 0]} scale={[0.1, 0.1, 0.1]} />

        <CannonContextProvider>
          <Plane position={[0, 0, 0]} />
          {
            gameState.value !== 'idle' &&
            gameState.value !== 'end' &&
            _dieIds.map((id) => (
              <Die3DComponent
                key={id}
                id={id}
                turnState={Object.values(gameState.value)[0]}
                isFrozen={frozenDice[id]}
                onFreeze={(e: THREE.Event) => handleFreeze(id)}
                onValueSet={(v: DieValue) => setValueForDie(id, v)}
              />
            ))
          }
        </CannonContextProvider>
      </Canvas>
    </>
  );
};

export default FarkleThreeCanvas;
