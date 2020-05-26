import React, { useEffect, useRef } from 'react';
import { State, Interpreter, StateValue } from 'xstate';
import { gameContext, gameEvent } from '../../Farkle';
import { FarkleLogic } from '../../FarkleLogic';
import { DiceKeyValueArray } from '../../Die';


type FarkleBotProps = {
  current: State<gameContext, gameEvent>,
  send: Interpreter<gameContext, any, gameEvent>['send'],
  bots?: Array<number> 
}

const FarkleBotComponent = ({current, send, bots}: FarkleBotProps) => {

  const shouldRollAgain = (turnScore:number, diceRemaining:number):boolean => {
    return (
      (
        turnScore <= FarkleLogic.BOT_MIN_SCORE &&
        diceRemaining >= 3
      ) ||
      diceRemaining === 0
    )
  }

  const allDice = useRef<DiceKeyValueArray>([])
  const freezableDice = useRef<DiceKeyValueArray>([])
  const rolledDice = useRef<DiceKeyValueArray>([])

  useEffect(() => {
    const player: StateValue = Object.keys(current.value)[0]
    if(bots && bots.map(b => `player-${b}`).includes(player)) {
      // The current player is a bot
      const turnState:StateValue = Object.values(current.value)[0]
      if(turnState === 'start') {
        send('ROLL')
      } else if (turnState === 'observing') {
        // If we haven't frozen anything this roll, update the dice refs
        if (current.context.frozenThisRoll.every(f => f === false))  {

          allDice.current = current.context.dice.map((v,i) => {
            return {
              id: i,
              value: v
            }
          })

          rolledDice.current = allDice.current.filter(d => !current.context.frozen[d.id])
          const freezableValues = FarkleLogic.getBestScoringMove(rolledDice.current.map(d => d.value))
          freezableDice.current = rolledDice.current.filter(d => freezableValues.includes(d.value))
        }

        const canEndTurn = FarkleLogic.canEndTurn(
          freezableDice.current.map(d => d.value), 
          current.context.scores[current.context.player],
          current.context.scoreThisRoll
        )

        const playerShouldRollAgain = shouldRollAgain(
          current.context.scoreThisRoll,
          allDice.current.filter(d => !current.context.frozen[d.id] && !current.context.frozenThisRoll[d.id]).length
        )

        if (freezableDice.current.length) {
          send('FREEZE', { dieId: freezableDice.current[0].id })
          freezableDice.current.splice(0,1)
        } else if (playerShouldRollAgain || !canEndTurn || current.context._firstTo10k >= 0) {
          setTimeout(() => {
            send('ROLL')
          }, 500);
        } else {
          setTimeout(() => {
            send('END_TURN')
          }, 1000);
        }
      } else if (turnState === 'farkle') {
        setTimeout(() => {
          send('END_TURN')
        }, 1000);
      }
    }
  }, [bots, current.context, current.value, send])
  return <></>
}

export default FarkleBotComponent;
