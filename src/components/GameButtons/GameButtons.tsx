import React, { useEffect, useState } from 'react';
import { useObservable } from '../../hooks/useObservable';
import { FarkleGame } from '../../game/Farkle';
//import { Test } from './GameButtons.styles';

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
