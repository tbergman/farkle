import React, { ChangeEvent, useEffect, useState } from 'react';
import { mapCount } from '../../../util/range';
import { Player, newPlayer, playerType } from '../../../game/player';
import GameButton from '../../GameButton';
import './GameConfig.styles.scss';

type GameConfigProps = {
  startGame(players: Array<Player>): void
}

const GameConfig = ({ startGame }: GameConfigProps) => {
  const [players, setPlayers] = useState<Array<Player>>([newPlayer(0), newPlayer(1)])

  const countPlayers = () => players.length

  useEffect(() => {
    const playersJSON = localStorage.getItem('farkle-players')
    if (playersJSON) {
      setPlayers(JSON.parse(playersJSON))
    }
  }, [])

  const handlePlayerCountChange = (n: number) => {
    const prevCount = players.length
    if (prevCount > n) {
      const _p = [...players]
      _p.splice(n)
      setPlayers(_p)
    } else if (prevCount < n) {
      const _p = [...players]
      _p.push(newPlayer(n - 1))
      setPlayers(_p)
    }
  }

  const handlePlayerTypeChange = (i: number, value: playerType) => {
    const _p = [...players]
    _p[i].type = value
    setPlayers(_p)
  }

  const handlePlayerNameChange = (i: number, value: string) => {
    const _p = [...players]
    _p[i].name = value
    setPlayers(_p)
  }

  return (
    <>
    <form id="player-picker-form">
      <div className="player-picker-form-field" id="player-count-field">
        <label htmlFor="player-count">Play with</label>
        <input className="player-form-input" id="player-count" type="number" min="2" max="6" value={countPlayers()} onChange={(e: ChangeEvent<HTMLInputElement>) => handlePlayerCountChange(Number(e.target.value))} />
        <span>players</span>
      </div>
      {mapCount(countPlayers(), (i) => (
        <div key={i} className="player-picker-form-field">
          <label className="player-picker-label" htmlFor={`type-player-${i + 1}`}>Player {i + 1}</label>
          <select
            name="player-type"
            className="player-form-input"
            id={`type-player-${i + 1}`}
            value={players[i].type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handlePlayerTypeChange(i, e.target.value as playerType)}
          >
            <option value="human">Human</option>
            <option value="computer">Computer</option>
          </select>
          {players[i].type === 'human' && <>
            <label className="player-picker-label" htmlFor={`name-player-${i}`}>named</label>
            <input
              className="player-form-input"
              type="text"
              id={`name-player-${i}`}
              value={players[i].name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handlePlayerNameChange(i, e.target.value)}
            />
          </>
          }
        </div>
      ))
      }
    </form>
    <GameButton onClick={() => startGame(players)}>Start game!</GameButton>
    </>
  )
}


GameConfig.propTypes = {
  // bla: PropTypes.string,
};

GameConfig.defaultProps = {
  // bla: 'test',
};

export default GameConfig;
