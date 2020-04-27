import React from 'react';

const GameButtons = ({turnState, roll, end}: GameButtonProps) => {

  return (
    <>
      {(turnState === 'ready' || turnState === 'start') && (
        <button onClick={() => roll()}>Roll</button>
      )}
      {(turnState === 'ready' || turnState === 'observing' || turnState === 'farkle') && (
        <button onClick={() => end()}>End Turn</button>
      )}
    </>
  );
};

type GameButtonProps = {
  turnState: string | undefined,
  roll: Function,
  end: Function
}

export default GameButtons;
