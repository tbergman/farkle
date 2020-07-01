import React, { useState } from 'react';
import GameButton from '../../GameButton';
import { Player } from '../../../game/player';
import './RemoteGameConfig.styles.scss';

type GameConfigProps = {
  roomCode: string,
  players: Array<Player>,
  connect(code: string, name: string):void,
  create(name: string):void,
  start():void,
}

const RemoteGameConfig = ({ roomCode, players, connect, create, start }: GameConfigProps) => {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const joinGame = () => { connect(code, name) }
  const createGame = () => { create(name) }

  return (
    <div className="remote-config">
      {!roomCode &&
        <>
        <h3>Join game</h3>
        <div id="player-picker-form">
          <div className="player-picker-form-field">
            <label htmlFor="code">Room Code</label>
            <input
              className="player-form-input"
              id="code"
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="4-letter room code"
            />
          </div>
          <div className="player-picker-form-field">
            <label htmlFor="name">Name</label>
            <input
              className="player-form-input"
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="player-picker-buttons">
            <GameButton 
              size="small" 
              onClick={joinGame} 
              isDisabled={!(name && code)}
              tooltip="Join the game"
              disabledTooltip="Enter a name and game code"
            >Join</GameButton>
            <label htmlFor="create">or</label>
            <GameButton 
              size="small" 
              onClick={createGame}
              isDisabled={!name} 
              tooltip="Create a new game"
              disabledTooltip="Enter a name"
            >Create Game</GameButton>
          </div>
          <div className="player-picker-form-field">
          </div>
        </div>
        </>
      }
      {roomCode &&
        <div className="remote-lobby">
        <div id="room-code-wrapper">Room Code: <h2 id="room-code">{roomCode}</h2></div>
        <h3>Playing with</h3>
          {
            players.map(player => {
              return (
                <div key={player.id}>{player.name}</div>
              )
            })
          }
        <GameButton onClick={start} >Start Game</GameButton>

        </div>
      }
    </div>
  );
}

RemoteGameConfig.propTypes = {
  // bla: PropTypes.string,
};

RemoteGameConfig.defaultProps = {
  // bla: 'test',
};

export default RemoteGameConfig;
