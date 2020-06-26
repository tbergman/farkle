import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { mapCount } from '../../../util/range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMinus, 
  faPlus, 
  // faUser, 
  // faLaptop
} from '@fortawesome/free-solid-svg-icons'
import { Player, newPlayer, playerType } from '../../../game/player';
import GameButton from '../../GameButton';
import './GameConfig.styles.scss';
import { FarkleLogic } from '../../../game/FarkleLogic';

type GameConfigProps = {
  startGame(players: Array<Player>): void
}

const GameConfig = ({ startGame }: GameConfigProps) => {
  const [players, setPlayers] = useState<Array<Player>>([newPlayer(0), newPlayer(1)])

  const countPlayers = () => players.length

  const addButton = useRef<any>()

  useEffect(() => {
    const playersJSON = localStorage.getItem('farkle-players')
    if (playersJSON) {
      setPlayers(JSON.parse(playersJSON))
    }
  }, [])

  const removePlayer = (i: number) => {
    if (players.length > 2) {
      const _p = [...players]
      _p.splice(i, 1)
      setPlayers(_p)
    }
  }

  const addPlayer = () => {
    if (players.length < FarkleLogic.MAX_PLAYERS) {
      const _p = [...players]
      _p.push(newPlayer(players.length))
      setPlayers(_p)
    }
    addButton.current.blur()
  }

  const updatePlayerType = (i: number, value: playerType) => {
    const _p = [...players]
    _p[i].type = value
    setPlayers(_p)
    if (value === 'computer') updatePlayerName(i, `Player ${i+1}`)
  }

  const updatePlayerName = (i: number, value: string) => {
    const _p = [...players]
    _p[i].name = value
    setPlayers(_p)
  }

  return (
    <>
    <div id="player-picker-form">
      {mapCount(countPlayers(), (i) => (
        <div key={i} className="player-picker-form-field">
          <input
            className="player-form-input"
            type="text"
            id={`name-player-${i}`}
            value={players[i].name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updatePlayerName(i, e.target.value)}
            disabled={players[i].type === 'computer'}
          />
          <select
            name="player-type"
            className="player-form-input"
            id={`type-player-${i + 1}`}
            value={players[i].type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => updatePlayerType(i, e.target.value as playerType)}
          >
            <option value="human">Player</option>
            <option value="computer">Computer</option>
          </select>
          <button 
            disabled={players.length <= 2}
            className="update-btn remove-player-button" 
            onClick={() => {removePlayer(i)}}>
              <FontAwesomeIcon icon={faMinus} />
          </button>
        </div>
      ))
    }
      <button 
        ref={addButton}
        disabled={players.length >= FarkleLogic.MAX_PLAYERS}
        className="update-btn add-player-button" 
        onClick={addPlayer}>
          <FontAwesomeIcon icon={faPlus} /> Add Player
      </button>
    </div>
    <GameButton className="start-button" onClick={() => startGame(players)}>Start game!</GameButton>
    </>
  )
}

export default GameConfig;
