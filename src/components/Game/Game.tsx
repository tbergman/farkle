import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { createFarkleGame } from '../../game/Farkle';
import FarkleThreeCanvas from '../../three/ThreeCanvas';
import { mergeBoolean } from '../../game/Turn';
import FarkleMessage from '../FarkleMessage';
import GameButtons from '../GameControls';
import TurnStatus from '../TurnStatus';
import ScoreTable from '../ScoreTable';

type GameProps = {
  players: number
}

const Game = ({players}: GameProps) => {
  const [current, send] = useMachine(createFarkleGame(players));
  const isGameStarted = current.value !== 'idle' && current.value !== 'end';
  const turnState = Object.values(current.value)[0];
  const logState = () => {
    console.log(current)
  }

  useEffect(() => {
    if (current) {
      send('START')
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
    { isGameStarted && 
      <>
        <FarkleMessage isVisible={turnState === 'farkle'} />
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
        <button className="log-button" onClick={() => logState()}>
          Log
          </button>
      </>
    }
    </>
  )  
}

Game.propTypes = {
  // bla: PropTypes.string,
};

Game.defaultProps = {
  // bla: 'test',
};

export default Game;
