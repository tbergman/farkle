/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import Die3DComponent from '../Die3DComponent';
import { CannonContextProvider } from '../CannonContext';
import { DiceValueArray, DieValue } from '../../game/Die';
import { State } from 'xstate';
import { gameContext, gameEvent } from '../../game/Farkle';
import { usePrevious } from '../../hooks/usePrevious';
import OrbitControlsComponent from './OrbitControls';
import { CAMERA_POSITION, SPOTLIGHT_POSITION, GROUND_SIZE } from '../constants';
import Camera from './Camera';
import Lighting from './Lighting';
import Boundary from '../Boundary';
import Ground from '../Ground';
import './ThreeCanvas.styles.scss';

type FarkleThreeCanvasProps = {
  gameState: State<gameContext, gameEvent, any, any>,
  frozenDice: Array<boolean>,
  sendGameEvent: Function,
}

const _dieIds = [0,1,2,3,4,5]
const _initDice:DiceValueArray = [0, 0, 0, 0, 0, 0];

const FarkleThreeCanvas = ({
  gameState,
  frozenDice,
  sendGameEvent,
}: FarkleThreeCanvasProps) => {
  
  const [dieValues, setDieValues] = useState<DiceValueArray>(_initDice);
  const prevTurnValue = usePrevious(Object.values(gameState.value)[0]);

  useEffect(() => {
    const turnValue = Object.values(gameState.value)[0];
    // If we've just entered "rolling" state, then reset the dice
    if (prevTurnValue !== 'rolling' && turnValue === 'rolling') {
      console.log('Rolling all')
      setDieValues(dieValues.map((d, i) => frozenDice[i] ? d : 0));
    } else if (turnValue === 'rolling' && dieValues.every(v => v!==0)) {
      // Send all dice values to Game when they're settled
      console.log('Sending SET_DICE', dieValues);
      sendGameEvent('SET_DICE', {values: dieValues});
    }
  }, [dieValues, frozenDice, gameState.value, prevTurnValue, sendGameEvent]);

  const setValueForDie = (id: number, newVal: DieValue) => {
    const _vals = [...(dieValues as Array<DieValue>)];
    _vals[id] = newVal;
    setDieValues(_vals);
  }

  // Send the "FREEZE" event to the Game
  const handleFreeze = (id: number) => {
    sendGameEvent('FREEZE', {dieId: id});
  }

  return (
    <>
      <Canvas
        className="three-canvas"
        style={{
          width: '100vw',
          height: `calc(100 * var(--vh))`,
          position: 'absolute',
          top: 0,
          zIndex: 0,
        }}
        onCreated={({gl}) => (
          // eslint-disable-next-line no-sequences
          (gl.shadowMap.enabled = true) as any,
          (gl.shadowMap.type = THREE.PCFSoftShadowMap) as any
        )}
      >
        <Camera position={CAMERA_POSITION} />
        {/* <StatsComponent /> */}
        <OrbitControlsComponent />


        <Lighting countSpotlights={3} />

        <CannonContextProvider>
          <Boundary />
          <Ground position={[0, 0, -0]} size={GROUND_SIZE} />
          {gameState.value !== 'idle' &&
            gameState.value !== 'end' &&
            _dieIds.map((id) => (
              <Die3DComponent
                key={id}
                id={id}
                // value={dieValues[id]}
                turnState={Object.values(gameState.value)[0]}
                isFrozen={frozenDice[id]}
                setValue={(v: DieValue) => setValueForDie(id, v)}
                onFreeze={(e: THREE.Event) => handleFreeze(id)}
              />
            ))}
        </CannonContextProvider>
      </Canvas>
    </>
  );
};

export default FarkleThreeCanvas;
