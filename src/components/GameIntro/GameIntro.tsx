import React, { useState } from 'react';
import './GameIntro.styles.scss'
import GameButton from '../GameButton';
import './GameIntro.styles.scss';
import GameInstructions from './GameInstructions';

type GameIntroProps = {
  startGame: Function
}

const GameIntro = ({startGame}: GameIntroProps) => {

  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <div className="intro-container">
      <section className="game-intro">
        <div className="intro-header">
          <h1 className="title">Farkle</h1>
          <GameButton onClick={() => startGame()}>Start game!</GameButton>
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
