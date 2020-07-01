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
import { Player } from '../../game/player';
import './Game.styles.scss';

type InternalGameComponentProps = {
  current: State<gameContext, gameEvent>,
  send: Interpreter<gameContext, any, gameEvent>['send'],
  bots?: Array<number>
}
const InternalGameComponent = ({current, send, bots}: InternalGameComponentProps) => {

  const turnState = Object.values(current.value)[0];

  const logState = () => {console.log(current)}
  const debug = () => {
    logState()
    debugger
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

  const getWinner = () => current.context.winner ? current.context.players[current.context.winner] : null

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
      <>
      <div className="message-wrapper">
        <WinnerMessage winner={getWinner()} />
        <FarkleMessage farkled={turnState === 'farkle'} />
      </div>
        <div className="game-chrome">
          <TurnStatus
            turnState={turnState}
            playerId={current.context.player}
            turnScore={current.context.scoreThisRoll}
          />
          <GameButtons 
            turnState={turnState} 
            sendGameEvent={sendGameEvent} 
          />
        </div>
        <ScoreTable
          names={current.context.players.map(p => p.name)}
          scores={current.context.scores}
          currentPlayer={current.context.player}
        />
        <button className="log-button" onClick={() => logState()}>Log</button>
        <button className="log-button" onClick={() => debug()}>Debug</button>

        <FarkleBotComponent 
          current={current} 
          send={send} 
          bots={bots}
        />
      </>
    </>
  )  
}

type GameProps = {
  players: Array<Player>,
}
export const LocalGame = ({ players }: GameProps) => {

  /** 
   * 
   * TODO:
   * Move the machine creation to middleware (RxJS webSocket?)
   * Get `current` and `send` objects from the middleware
   * Communicate with the machine through middleware
   * 
   * Game will then be 2 components, OnlineGame and LocalGame
   * Both will use InternalGameComponent
   * -- InternalGameComponent will need to know which player is the local player
   * -- in addition to which are bots
   * 
   */   

  try {
    // Try creating a machine 
    const [current, send] = useMachine(createFarkleGame(players));
    const bots = players
      .map((p, i) => { return { t: p.type, i } })
      .filter(ti => ti.t === 'computer')
      .map(ti => ti.i)
    return <InternalGameComponent current={current} send={send} bots={bots}/>
  } catch (error) {
    // go back home if we can't create the machine
    return <Redirect to="/" />
  }
}

// TODO => `current` is being sent as gameContext
// server needs to sent the current state
type RemoteGameProps = {
  current: any,//State<gameContext, gameEvent, any, any>
  send(type: string, payload?: any): any
}
export const RemoteGame = ({current, send}: RemoteGameProps) => {
  console.log('Received new state')
  const sentEvent = send as Interpreter<gameContext, any, gameEvent>['send']
  return <InternalGameComponent current={current} send={sentEvent} />
}
