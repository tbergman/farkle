import React from 'react';
import { StateValue } from 'xstate';
import './GameControls.styles.scss'
import GameButton from '../GameButton';

type GameButtonProps = {
  turnState: StateValue,
  sendGameEvent: Function
}

const GameControls = ({turnState, sendGameEvent}: GameButtonProps) => {

  return (
    <div className="game-buttons">
      {(turnState === 'ready' || turnState === 'observing' || turnState === 'start') && (
        <GameButton onClick={() => sendGameEvent('ROLL')}>Roll</GameButton>
      )}
      {(turnState === 'ready' || turnState === 'observing' || turnState === 'farkle' ) && (
        <GameButton onClick={() => sendGameEvent('END_TURN')}>End Turn</GameButton>
      )}
    </div>
  );
};


export default GameControls;
