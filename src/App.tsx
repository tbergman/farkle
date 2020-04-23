import React, { useEffect, useState } from 'react';
import './App.scss';
import {FarkleGame} from './game/Farkle';
import { useObservable } from './hooks/useObservable';
import DiceArrayComponent from './components/DiceArray';
import GameButtons from './components/GameButtons';
import TurnStatus from './components/TurnStatus';
import { DiceArray } from './game/GameDice';
import { FarkleSim } from './game/bots/FarkleSim';
import ScoreTable from './components/ScoreTable';
import { useExternalState } from './hooks/useExternalState';
import { useForceUpdate } from './hooks/useForceUpdate';

const _Game = new FarkleGame(2);
const sim = new FarkleSim(_Game)

function App() {
  let Game = _Game
  const forceUpdate = useForceUpdate();

  const isGameStarted = useExternalState(Game.isStarted);
  const isGameEnded = useExternalState(Game.isEnded)
  const winner = useExternalState(Game.getWinner())
  const currentPlayer = useExternalState(Game.currentPlayer);

  const dice:DiceArray = useObservable(Game.gameDice.roll$)
  const frozenDice:DiceArray = useObservable(currentPlayer?.currentTurn?.frozeN)
  const turnState = useObservable(currentPlayer?.currentTurn?.state$, [currentPlayer]);
  const [stateValue, setStateValue] = useState();
  useEffect(() => {
    setStateValue(turnState?.value || '');
  }, [turnState, currentPlayer]);


  const startGame = () => {
    Game.startGame();
    forceUpdate()
  }

  const newGame = () => {
    Game = new FarkleGame(2)
    forceUpdate();
  }

  return (
    <div className="App">
      {isGameStarted ? (
        isGameEnded && winner ? (
          <>
            <h1>Winner</h1>
            <h2>Player {winner.id + 1}</h2>
            <h3>Score {winner.score}</h3>
            <button onClick={() => newGame()}>Play Again</button>
          </>
        ) : (
          <>
            <TurnStatus player={currentPlayer} />
            <br/>
            {dice && (
              <DiceArrayComponent
                turnState={stateValue}
                dice={dice}
                frozen={frozenDice}
                onClickDie={(i: number) => Game.freezeDie(i)}
              />
            )}
            <br/>
            <GameButtons
              turnState={stateValue}
              roll={() => Game.roll()}
              end={() => Game.endTurn()}
            />
            <br/>
            <ScoreTable players={Game.Players} />
          </>
        )
      ) : (
        <button onClick={() => startGame()}>Start game!</button>
        // <button onClick={() => sim.start()}>Start Sim</button>
      )}
    </div>
  );
}

export default App;
