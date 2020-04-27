import React from 'react';

type DieProps = {
  isFrozen: boolean,
  index: number,
  value: number,
  onDieClick: Function
}

const Die = ({isFrozen, index, value, onDieClick}: DieProps) => (
  <button
    className={isFrozen ? 'frozen die' : 'unfrozen die'}
    key={index}
    onClick={() => onDieClick(index)}
  >
    {value}
  </button>
);

export default Die;
