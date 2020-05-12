import React, { useEffect, useCallback } from 'react';
import './App.scss';
import { createFarkleGame } from './game/Farkle';
import { useMachine } from '@xstate/react';
import { mergeBoolean } from './game/Turn';
import ScoreTable from './components/ScoreTable';
import TurnStatus from './components/TurnStatus';
import FarkleThreeCanvas from './three/ThreeCanvas';
import GameButtons from './components/GameControls';
import GameIntro from './components/GameIntro';

function App() {
  const [current, send] = useMachine(createFarkleGame(2));
  const isGameStarted = current.value !== 'idle' && current.value !== 'end';
  const turnState = Object.values(current.value)[0];

  const logState = () => {
    console.log(current)
  }

  const sendGameEvent = useCallback(send, [])

  return (
    <div className="App">
      <FarkleThreeCanvas
        gameState={current}
        frozenDice={mergeBoolean(
          current.context.frozen,
          current.context.frozenThisRoll
        )}
        sendGameEvent={sendGameEvent}
      />
      {isGameStarted ? (
        <>
          <TurnStatus 
            turnState={turnState} 
            playerId={current.context.player} 
            turnScore={current.context.turnScore}
          />
          <GameButtons turnState={turnState} sendGameEvent={send} />
          <ScoreTable scores={current.context.scores}/>
          <button className="log-button" onClick={() => logState()}>Log</button>
        </>
      ) : (
        <GameIntro startGame={() => send('START')} />
      )}
    </div>
  );
}

export default App;
