import React, { useEffect, useState } from 'react';
import { Player } from '../../game/Player';
import { useObservable } from '../../hooks/useObservable';
//import { Test } from './TurnStatus.styles';

const TurnStatus = ({player}: TurnStatusProps) => {
  useEffect(() => {
    console.log(score);
  })

  const [score, setScore] = useState(0)
  useEffect(() => {
    setScore(player.currentTurn ? player.currentTurn.tempScore : 0);
  }, [player.currentTurn, player.currentTurn?.tempScore]);
  
  const turnState = useObservable(player.turnState$)

  return (
    <>
      <h3>Player {player.id + 1}</h3>
      {turnState && <h4>{turnState.value}</h4>}
      <h4>Score this turn: {score}</h4>
    </>
  );
};

type TurnStatusProps = {
  player: Player
}

export default TurnStatus;
