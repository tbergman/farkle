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
      {dice.map(
        (d: number, i: number) =>
          turnState !== 'start' && (
            <Die
              value={d}
              index={i}
              isFrozen={frozen[i]}
              isRolling={!frozen[i] && turnState === 'rolling'}
              onDieClick={() => onDieClick(i)}
            />
          )
      )}
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
