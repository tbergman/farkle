import React from 'react';
import { StateValue } from 'xstate';
import classNames from 'classnames';
import './TurnStatus.styles.scss';


type TurnStatusProps = {
  playerId: number
  turnScore: number,
  turnState: StateValue
}

const TurnStatus = ({playerId, turnScore, turnState}: TurnStatusProps) => {
  
  return (
    <div className="turn-status">
        <h2
          className={classNames('farkle-message', {
            is_visible: turnState === 'farkle',
          })}
        >Farkle!</h2>
      <h3>Player {playerId + 1}</h3>
      {/* <h4>{turnState}</h4>   */}
      <h4>Score this turn: {turnScore}</h4>
    </div>
  );
};

export default TurnStatus;
