import React from 'react';
import './GameIntro.styles.scss'
import GameButton from '../GameButton';

type GameIntroProps = {
  startGame: Function
}

const GameIntro = ({startGame}: GameIntroProps) => {
  return (
    <section className="game-intro">
      <h1>Let's play Farkle</h1>
      <GameButton onClick={() => startGame()}>Start game!</GameButton>
    </section>
  );
}

export default GameIntro;
