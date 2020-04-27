import React from 'react';
import Die from "../Die"
import './DiceArray.styles.scss';
import { DiceValueArray } from '../../game/Die';
import { StateValue } from 'xstate';

const DiceArrayComponent = ({
  turnState,
  dice,
  frozen,
  onDieClick,
}: DiceArrayComponentProps) => {
  return (
    <div className="dice-array">
      {turnState !== 'start' &&
        dice.map((d: number, i: number) => (
          <Die
            isFrozen={frozen[i]}
            value={d}
            index={i}
            onDieClick={() => onDieClick(i)}
          />
        ))}
    </div>
  );
};

type DiceArrayComponentProps = {
  turnState: StateValue,
  dice: DiceValueArray, 
  frozen: Array<boolean>,
  onDieClick: Function
} 
export default DiceArrayComponent;
