import React, { useState, ChangeEvent } from 'react';
import './GameIntro.styles.scss'
import GameButton from '../GameButton';
import GameInstructions from './GameInstructions';

type GameIntroProps = {
  startGame(n: number): void
}

const GameIntro = ({startGame}: GameIntroProps) => {

  const [showInstructions, setShowInstructions] = useState(false)
  const [countPlayers, setCountPlayers] = useState<number>(2)

  return (
    <div className="intro-container">
      <section className="game-intro">
        <div className="intro-header">
          <h1 className="title">Farkle</h1>
          <form id="player-picker-form">
            <label htmlFor="player-count">Play with</label>
            <input id="player-count" type="number" min="2" max="6" value={countPlayers} onChange={(e: ChangeEvent<HTMLInputElement>) => setCountPlayers(Number(e.target.value))}/>
            <span>players</span>
          </form>
          <GameButton onClick={() => startGame(countPlayers)}>Start game!</GameButton>
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
