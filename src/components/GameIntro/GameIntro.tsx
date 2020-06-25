import React, { useState } from 'react';
import GameInstructions from './GameInstructions';
import { Player } from '../../game/player';
import GameConfig from './GameConfig';
import './GameIntro.styles.scss'
import GameSourceConfig from './GameSourceConfig';

type GameIntroProps = {
  startGame(players: Array<Player>): void
}

type GameSource = 'server' | 'client' | null

const GameIntro = ({startGame}: GameIntroProps) => {

  const [showInstructions, setShowInstructions] = useState(false)
  const [gameSource, setGameSource] = useState<GameSource>(null)

  const ConfigComponent = () => {
    if (gameSource === 'client') {
      return <GameConfig startGame={startGame} /> 
    } else if (gameSource === 'server') {
      return <GameSourceConfig setSource={setGameSource} />
    } else {
      return <GameSourceConfig setSource={setGameSource}/>
    }
  }

  return (
    <div className="intro-container">
      <section className="game-intro">
        <div className="intro-header">
          <h1 className="title">Farkle</h1>
          <ConfigComponent />
          <br/>
          <button 
            className="toggle-instructions-button" 
            onClick={() => {setShowInstructions(!showInstructions)}}>
              {showInstructions ? 'Hide' : 'Show'} instructions
          </button>
        </div>
        {showInstructions && <GameInstructions />}
      </section>
    </div>
  );
}

export default GameIntro;
