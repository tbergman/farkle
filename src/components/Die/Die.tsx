import React from 'react';
import classNames from 'classnames';
import './Die.styles.scss';

type DieProps = {
  isRolling: boolean,
  isFrozen: boolean,
  index: number,
  value: number,
  onDieClick: Function
}

const Die = ({index, value, onDieClick, isFrozen, isRolling}: DieProps) => (
  <button
    className={classNames('die', {
      is_frozen: isFrozen,
      is_rolling: isRolling,
    })}
    key={index}
    onClick={() => onDieClick(index)}
  >
    {value}
  </button>
);

export default Die;
