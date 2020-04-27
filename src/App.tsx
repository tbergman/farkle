import React from 'react';
import './App.scss';
import { createFarkleGame } from './game/Farkle';
import { useMachine } from '@xstate/react';
import DiceArrayComponent from './components/DiceArray';
import { mergeBoolean } from './game/Turn';
import ScoreTable from './components/ScoreTable';
import TurnStatus from './components/TurnStatus';

function App() {
  const [current, send] = useMachine(createFarkleGame(2));
  const isGameStarted = current.value !== 'idle' && current.value !== 'end';
  const turnState = Object.values(current.value)[0];

  const logState = () => {
    console.log(current)
  }

  return (
    <div className="App">
      {isGameStarted ? (
        <>
          <TurnStatus
            playerId={current.context.player}
            turnScore={current.context.scoreThisRoll}
            turnState={turnState}
          />
          {
            <DiceArrayComponent
              dice={current.context.dice}
              frozen={mergeBoolean(
                current.context.frozen,
                current.context.frozenThisRoll
              )}
              turnState={turnState}
              onDieClick={(i: number) => send({type: 'FREEZE', dieId: i})}
            />
          }
          <br />
          <button onClick={() => send('ROLL')}>ROLL</button>
          <button onClick={() => send('END_TURN')}>End turn</button>
          <ScoreTable scores={current.context.scores} />
          <button onClick={() => logState()}>Log</button>
        </>
      ) : (
        <button onClick={() => send('START')}>Start game!</button>
      )}
    </div>
  );
}

export default App;
