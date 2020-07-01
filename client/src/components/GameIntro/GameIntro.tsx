import React, { useState } from 'react';
import GameInstructions from './GameInstructions';
import { Player } from '../../game/player';
import LocalGameConfig from './LocalGameConfig';
import './GameIntro.styles.scss'
import RemoteGameConfig from './RemoteGameConfig';

type GameIntroProps = {
  // startGame(players: Array<Player>): void,
  // source: 'server' | 'client',
  // setSource(source: 'server' | 'client'): void
  children: React.ReactNode
}

const GameIntro = ({ children }: GameIntroProps) => {
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <div className="intro-container">
      <section className="game-intro">
        <div className="intro-header">
          <h1 className="title">Farkle</h1>
          {children}
          <button 
            className="text-button" 
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
