import { Machine, StatesConfig, send, assign, ActionObject, ActionFunction, ConditionPredicate } from "xstate";
// import { Player } from "./Player";
// import { GameDice, DiceArray } from "./GameDice";
// import { Subject, from, Observable, ObservableInput } from "rxjs";
import {FarkleLogic} from './FarkleLogic';
import { DieValue, DiceValueArray } from "./Die";
import {gameContext, gameEvent} from './Farkle';


const initialDice: DiceValueArray = [0, 0, 0, 0, 0, 0];
const initialFrozen = [false, false, false, false, false, false];

/**
 * 
 * HEPERS
 */
const dieRoll = (): DieValue => (Math.round(Math.random() * 5) + 1) as DieValue;

export const getFrozen = (dice: DiceValueArray, frozen: Array<boolean>) => {
  return dice.filter((_, i) => !!frozen[i]);
};
export const getUnfrozen = (dice: DiceValueArray, frozen: Array<boolean>) => {
  return dice.filter((_, i) => !frozen[i]);
};
export const mergeBoolean = (arr1: Array<boolean>, arr2: Array<boolean>):Array<boolean> => {
  return arr1.map((a,i) => a || arr2[i])
}
// const = (dice: DiceValueArray) => FarkleLogic.DiceArrayFromValues(dice);

/**
 * 
 * MACHINE
 */
export const turnStates: StatesConfig<gameContext, any, gameEvent> = {
  start: {
    on: {
      ROLL: {
        target: 'rolling',
      },
    },
  },

  rolling: {
    on: {
      SET_DICE: [
        { 
          actions: 'setDice',
          target: 'observing',
        }
      ]
    }
    // entry: [
    //   'rollUnfrozen',
    // ],
    // after: {
    //   100: [
    //     {
    //       target: 'observing',
    //       cond: 'isValidMoveAvailable',
    //     },
    //     {
    //       target: 'farkle',
    //     },
    //   ],
    // }
  },

  observing: {
    on: {
      '' : {
        target: 'farkle',
        cond: 'isFarkle'
      },
      FREEZE: {
        actions: [
          'doFreeze',
          'setTempScore'
        ],
        cond: 'isFreezeInValidMove'
      },
      ROLL: {
        target: 'rolling',
        cond: 'canRollAgain',
      },
      END_TURN: {
        target: 'end',
        actions: 'saveTurnScore',
        cond: 'canEndTurn',
      },
    },
    exit: [
      'saveTurnScore',
      'commitFrozen'
    ]
  },
  farkle: {
    entry: 'resetScore',
    after: {
      2000: 'end',
    },
  },
  end: {
    type: 'final',
    entry: [
      'commitScore',
      'resetTurnContext',
      'endTurn'
    ]
  },
};

/**
 * 
 * GUARDS
 */
type turnGuard = Record<string, ConditionPredicate<gameContext, gameEvent>>
export const turnGuards: turnGuard = {

  isValidMoveAvailable: (c, e)  => {
    const validExists = FarkleLogic.doesValidMoveExist(
      getUnfrozen(c.dice, c.frozen)
    );
    return validExists
  },

  isFarkle: (c, e) => {
    const validExists = FarkleLogic.doesValidMoveExist(
      getUnfrozen(c.dice, c.frozen)
    );
    if (!validExists) {
      console.log(`You FARKLED!!!`, getUnfrozen(c.dice, c.frozen));
    } 
    return !validExists
  },

  isValidFreezeState: (c, e)  => {
    return FarkleLogic.isValidMove(
      getFrozen(c.dice, c.frozen)
    );
  },

  // TODO - Implement this
  isFreezeInValidMove: (c, e) => true,

  canRollAgain: (c, e)=> {
    const fzn = getFrozen(c.dice, c.frozenThisRoll);
    const canRoll =
      FarkleLogic.isValidMove(fzn) && 
      c.frozenThisRoll.filter((f) => !!f).length > 0;
    if (!canRoll) {
      console.log(`Can roll again? ${canRoll}.`, fzn)
    }
    return canRoll
  },

  canEndTurn: (c, e) => {
    const dice = getFrozen(c.dice, mergeBoolean(c.frozen, c.frozenThisRoll));
    const validMove = FarkleLogic.isValidMove(dice)
    console.log(
      `Trying to end turn. Is this a valid move? ${validMove}. Total score: ${c.turnScore + c.scoreThisRoll}`
    );
    if (!validMove) {console.log(dice)}
    return (
      validMove &&
      (c.scores[c.player] > FarkleLogic.REQUIRED_POINTS_ON_BOARD || 
        (c.turnScore + c.scoreThisRoll) >= FarkleLogic.REQUIRED_POINTS_ON_BOARD
      )
    );
  }
};

/**
 * 
 * ACTIONS
 */
type turnAction = Record<string, | ActionObject<gameContext, gameEvent> | ActionFunction<gameContext, gameEvent>>
export const turnActions: turnAction = {

  setDice: assign({
    dice: (c,e) => e.type === 'SET_DICE' ? e.values : [...initialDice]
  }),

  rollUnfrozen: assign({
    dice: (c,e) => {
      return c.frozen.map((f, i) => {
        return !f ? dieRoll() : c.dice[i]
      });
    }
  }),

  doFreeze: assign({
    frozenThisRoll: (c,e) => {
      if (e.type === 'FREEZE') {
        const id = e.dieId;
        console.log(`XSTATE: Freezing ${id}`)
        // if this die is not already frozen from another roll 
        if (!c.frozen[id]) {
          const _tmp_frzn = [...c.frozenThisRoll]
          _tmp_frzn[e.dieId] = !_tmp_frzn[id]
          return _tmp_frzn
        }
      }
      return c.frozenThisRoll
    },
  }),

  setTempScore: assign({
    scoreThisRoll: (c,e) => {
      const score = c.turnScore + FarkleLogic.scoreMove(
        getFrozen(c.dice, c.frozenThisRoll)
      )
      return score
    }
  }),

  saveTurnScore: assign({
    turnScore: (c,e) => c.turnScore + FarkleLogic.scoreMove(
      getFrozen(c.dice, c.frozenThisRoll)
    ),
  }),

  commitScore: assign({
    scores: (c,e) => {
      const _tmp_scores = [...c.scores]
      _tmp_scores[c.player] = _tmp_scores[c.player] + c.turnScore;
      return _tmp_scores
    }
  }),

  resetScore: assign({
    turnScore: (c,e) => 0,
    scoreThisRoll: (c,e) => 0
  }),

  commitFrozen: assign({
    frozen: (c,e) => {
      const _fzn = mergeBoolean(c.frozen, c.frozenThisRoll)
      return getUnfrozen(c.dice, _fzn).length > 0 ? _fzn : [...initialFrozen];
    },
    frozenThisRoll: (c,e) => [...initialFrozen],
  }),

  resetTurnContext: assign({
    // We don't really need to reset the dice to 0, it just makes it easier to know we've ended the turn
    dice: (c,e) => [...initialDice],
    frozenThisRoll: (c,e) => [...initialFrozen],
    frozen: (c,e) => [...initialFrozen],
    scoreThisRoll: (c,e) => 0,
    turnScore: (c,e) => 0,
  }),

  endTurn: send('TURN_ENDED')
};
