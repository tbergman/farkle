import React, { useState, useRef, useEffect } from 'react';
import GameButton from '../../GameButton';
import { Player } from '../../../game/player';
//import { Test } from './RemoteGameConfig.styles';

type GameConfigProps = {
  roomCode: string,
  players: Array<Player>,
  connect(code: string, name: string):void,
  create(name: string):void,
  start():void,
}

const RemoteGameConfig = ({ roomCode, players, connect, create, start }: GameConfigProps) => {
  const [isHost, setIsHost] = useState(true)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const joinGame = () => { connect(code, name) }
  const createGame = () => { create(name) }

  return (
    <>
      {!roomCode &&
        <>
        <h3>Join game</h3>
          <div id="player-picker-form">
            <label htmlFor="name">Name</label>
            <input
              className="player-form-input"
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <label htmlFor="code">Code</label>
            <input
              className="player-form-input"
              id="code"
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <GameButton size="small" onClick={joinGame} >Join</GameButton>
            <div>
              <label htmlFor="create">or</label>
              <GameButton size="small" onClick={createGame} >Create Game</GameButton>
            </div>
          </div>
        </>
      }
      {roomCode &&
        <>
        <h2>Room Code: {roomCode}</h2>
        <h3>Playing with</h3>
          {
            players.map(player => {
              return (
                <div key={player.id}>{player.name}</div>
              )
            })
          }
        <GameButton onClick={start} >Start Game</GameButton>

        </>
      }
    </>
  );
}

RemoteGameConfig.propTypes = {
  // bla: PropTypes.string,
};

RemoteGameConfig.defaultProps = {
  // bla: 'test',
};

export default RemoteGameConfig;
