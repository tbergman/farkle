import React, { useEffect } from 'react';
import { DiceArray } from '../../game/GameDice';
import { Die } from '../../game/Die';
import './DiceArray.styles.scss';

const DiceArrayComponent = ({turnState, dice, frozen, onClickDie}: DiceArrayComponentProps) => {

  // useEffect(() => {
  //   console.log('Frozen updated', frozen)
  // }, [frozen])

  return (
    <div className="dice-array">
    { turnState !== 'start' &&
      dice.map((d: Die, i: number) => (
          <button
            className={
              frozen && frozen.map((d) => d.id).includes(i) ? 'frozen die' : 'unfrozen die'
            }
            key={i}
            onClick={() => onClickDie(i)}
          >
            {d.value}
          </button>
        )
      )
    }
    </div>
  )
};

type DiceArrayComponentProps = {
  turnState: string | undefined,
  dice: DiceArray, 
  frozen: DiceArray,
  onClickDie: Function
} 
export default DiceArrayComponent;
