import React from 'react';
import { StateValue } from 'xstate';
import './GameButtons.styles.scss'
import GameButton from '../GameButton/GameButton';

type GameButtonProps = {
  turnState: StateValue,
  sendGameEvent: Function
}

const GameButtons = ({turnState, sendGameEvent}: GameButtonProps) => {

  return (
    <div className="game-buttons">
      {(turnState === 'ready' || turnState === 'observing' || turnState === 'start') && (
        <GameButton onClick={() => sendGameEvent('ROLL')}>Roll</GameButton>
      )}
      {(turnState === 'ready' || turnState === 'observing' ) && (
        <GameButton onClick={() => sendGameEvent('END_TURN')}>End Turn</GameButton>
      )}
    </div>
  );
};


export default GameButtons;
