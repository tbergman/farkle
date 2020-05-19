import React from 'react';
import { StateValue } from 'xstate';
import './TurnStatus.styles.scss';

type TurnStatusProps = {
  playerId: number
  turnScore: number,
  turnState: StateValue
}

const TurnStatus = ({playerId, turnScore}: TurnStatusProps) => {
  
  return (
    <div className="turn-status">
      {/* <h2 className="status-player">Player {playerId + 1}</h2> */}
      <h3 className="status-score">Score this turn: {turnScore}</h3>
    </div>
  );
};

export default TurnStatus;
