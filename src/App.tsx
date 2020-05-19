import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { createFarkleGame } from './game/Farkle';
import { mergeBoolean } from './game/Turn';
import './App.scss';
import ScoreTable from './components/ScoreTable';
import TurnStatus from './components/TurnStatus';
import FarkleThreeCanvas from './three/ThreeCanvas';
import GameButtons from './components/GameControls';
import GameIntro from './components/GameIntro';
import FarkleMessage from './components/FarkleMessage';


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
          <FarkleMessage isVisible={turnState === 'farkle'}/>
          <div className="game-chrome">
            <TurnStatus
              turnState={turnState}
              playerId={current.context.player}
              turnScore={current.context.scoreThisRoll}
            />
            <GameButtons turnState={turnState} sendGameEvent={send} />
          </div>
          <ScoreTable scores={current.context.scores} />
          <button className="log-button" onClick={() => logState()}>
            Log
          </button>
        </>
      ) : (
        <GameIntro startGame={() => send('START')} />
      )}
    </div>
  );
}

export default App;
