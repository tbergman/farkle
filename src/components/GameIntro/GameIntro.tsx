import React, { useState } from 'react';
import GameInstructions from './GameInstructions';
import { Player } from '../../game/player';
import GameConfig from './GameConfig';
import './GameIntro.styles.scss'

type GameIntroProps = {
  startGame(players: Array<Player>): void
}

type GameSource = 'server' | 'client'

const GameIntro = ({startGame}: GameIntroProps) => {
  const [showInstructions, setShowInstructions] = useState(false)
  const [gameSource, setGameSource] = useState<GameSource>('client')  

  return (
    <div className="intro-container">
      <section className="game-intro">
        <div className="intro-header">
          <h1 className="title">Farkle</h1>
          {gameSource === 'client' && <GameConfig startGame={startGame} /> }
          {gameSource === 'server' && <div></div>}
          <button 
            className="text-button" 
            onClick={() => {setShowInstructions(!showInstructions)}}>
              {showInstructions ? 'Hide' : 'Show'} instructions
          </button>
          {gameSource === 'client' && <button className="text-button" onClick={() => setGameSource('server')}>Play online</button>}
          {gameSource === 'server' && <button className="text-button" onClick={() => setGameSource('client')}>Play on this device</button>}
        </div>
        {showInstructions && <GameInstructions />}
      </section>
    </div>
  );
}

export default GameIntro;
