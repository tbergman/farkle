import React, { useEffect } from 'react';
import './App.scss';
import { createFarkleGame } from './game/Farkle';
import { useMachine } from '@xstate/react';
import DiceArrayComponent from './components/DiceArray';
import { mergeBoolean } from './game/Turn';
import ScoreTable from './components/ScoreTable';
import TurnStatus from './components/TurnStatus';
import FarkleThreeCanvas from './three/ThreeCanvas';

function App() {
  const [current, send] = useMachine(createFarkleGame(2));
  const isGameStarted = current.value !== 'idle' && current.value !== 'end';
  const turnState = Object.values(current.value)[0];

  const logState = () => {
    console.log(current)
  }

  return (
    <div className="App">
      <FarkleThreeCanvas
        gameState={current}
        frozenDice={mergeBoolean(
          current.context.frozen,
          current.context.frozenThisRoll
        )}
        sendGameEvent={send}
      />
      {isGameStarted ? (
        <>
          <button onClick={() => send('ROLL')}>ROLL</button>
          <button onClick={() => send('END_TURN')}>End turn</button>
          <button onClick={() => logState()}>Log</button>
        </>
      ) : (
        <button onClick={() => send('START')}>Start game!</button>
      )}
    </div>
  );
}

export default App;
