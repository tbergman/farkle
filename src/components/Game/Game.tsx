import React, { useCallback, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { createFarkleGame, gameContext, gameEvent } from '../../game/Farkle';
import FarkleThreeCanvas from '../../three/ThreeCanvas';
import { mergeBoolean } from '../../game/Turn';
import FarkleMessage from '../messages/FarkleMessage';
import GameButtons from '../GameControls';
import TurnStatus from '../TurnStatus';
import ScoreTable from '../ScoreTable';
import WinnerMessage from '../messages/WinnerMessage';
import { State, Interpreter } from 'xstate';
import { Redirect } from 'react-router-dom';
import FarkleBotComponent from '../../game/bots/FarkleBotComponent';

type InternalGameComponentProps = {
  current: State<gameContext, gameEvent>,
  send: Interpreter<gameContext, any, gameEvent>['send']
}

const InternalGameComponent = ({current, send}: InternalGameComponentProps) => {

  const isGameStarted = current.value !== 'idle' && current.value !== 'end';
  const turnState = Object.values(current.value)[0];

  const logState = () => {
    console.log(current)
  }

  useEffect(() => {
    if (current.matches('idle')) {
      send('START')
    } else if (current.matches('end_game')) {
      console.log('Game over', current.context)
    } else {
      // console.log(current)
    }
  }, [current, send])

  const sendGameEvent = useCallback(send, [])

  return (
    <>
      <FarkleThreeCanvas
        gameState={current}
        frozenDice={mergeBoolean(
          current.context.frozen,
          current.context.frozenThisRoll
        )}
        sendGameEvent={sendGameEvent}
      />
      {isGameStarted &&
        <>
        <div className="message-wrapper">
          <WinnerMessage winner={current.context.winner} />
          <FarkleMessage isVisible={turnState === 'farkle'} />
        </div>
          <div className="game-chrome">
            <TurnStatus
              turnState={turnState}
              playerId={current.context.player}
              turnScore={current.context.scoreThisRoll}
            />
            <GameButtons turnState={turnState} sendGameEvent={sendGameEvent} />
          </div>
          <ScoreTable
            scores={current.context.scores}
            currentPlayer={current.context.player}
          />
          <button className="log-button" onClick={() => logState()}>Log</button>

          <FarkleBotComponent 
            current={current} 
            send={send} 
            bots={[0,1]}
          />
        </>
      }
    </>
  )  
}

type GameProps = {
  players: number,
}
const Game = ({ players }: GameProps) => {
  try {
    const [current, send] = useMachine(createFarkleGame(players));
    return <InternalGameComponent current={current} send={send} />
  } catch (error) {
    return <Redirect to="/" />
  }
}

export default Game;
