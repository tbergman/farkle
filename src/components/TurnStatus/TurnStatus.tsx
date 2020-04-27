import React from 'react';
import { StateValue } from 'xstate';

const TurnStatus = ({playerId, turnScore, turnState}: TurnStatusProps) => {
  
  return (
    <>
      <h3>Player {playerId + 1}</h3>
      <h4>{turnState}</h4>  
      <h4>Score this turn: {turnScore}</h4>
    </>
  );
};

type TurnStatusProps = {
  playerId: number
  turnScore: number,
  turnState: StateValue
}

export default TurnStatus;
