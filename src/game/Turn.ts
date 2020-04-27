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
 * TYPES
 */
export type turnContext = {
  dice: DiceValueArray;
  frozen: Array<boolean>;
  score: number;
};

export type turnEvent =
  | {type: 'ROLL'}
  | {type: 'FREEZE'; dieId: number}
  | {type: 'END_TURN'};

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
    entry: [
      'rollUnfrozen',
    ],
    after: {
      1000: [
        {
          target: 'observing',
          cond: 'isValidMoveAvailable',
        },
        {
          target: 'farkle',
        },
      ],
    }
  },

  observing: {
    on: {
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
      1000: 'end',
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

  isValidFreezeState: (c, e)  => {
    return FarkleLogic.isValidMove(
      getFrozen(c.dice, c.frozen)
    );
  },

  // TODO - Implement this
  isFreezeInValidMove: (c, e) => true,

  canRollAgain: (c, e)=> {
    const canRoll =
      FarkleLogic.isValidMove(
        getFrozen(c.dice, c.frozenThisRoll)
      ) && c.frozenThisRoll.filter((f) => !!f).length > 0;
    return canRoll
  },

  canEndTurn: (c, e) => {
    const validMove = FarkleLogic.isValidMove(
      getFrozen(
        c.dice, 
        mergeBoolean(c.frozen, c.frozenThisRoll)
      )
    )

    return (
      validMove &&
      (c.scores[c.player] > 1000 || c.turnScore >= 1000)
    );
  }
};

/**
 * 
 * ACTIONS
 */
type turnAction = Record<string, | ActionObject<gameContext, gameEvent> | ActionFunction<gameContext, gameEvent>>
export const turnActions: turnAction = {
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

// export class Turn {
//   readonly turnStateMachine = Machine({
//     id: 'turn',
//     initial: 'start',
//     states: {
//       start: {
//         on: {
//           ROLL: 'observing'
//         }
//       },
//       ready: {
//         on: {
//           VALID_MOVE: 'ready',
//           INVALID_MOVE: 'observing',
//           ROLL: 'observing',
//           END: 'end',
//         },
//       },
//       observing: {
//         on: {
//           VALID_MOVE: 'ready',
//           INVALID_MOVE: 'observing',
//           FARKLE: 'farkle',
//         },
//       },
//       farkle: {
//         on: {
//           END: 'end'
//         }
//       },
//       end: {
//         type: 'final',
//       },
//     },
//   });
//   readonly stateService = interpret(this.turnStateMachine)
//     .onTransition((state) => console.log('Set state:', state.value));
//   readonly player: Player;
//   readonly dice: GameDice;
//   private roll$: Subject<DiceArray>;
//   public state$:Observable<any>;
//   public frozeN: Subject<DiceArray>;
//   private freeze$: Subject<number>;
//   score$: Subject<number>;
//   private _dieStates: Array<boolean>;
//   private _tmp_frozen: Array<boolean>;
//   public turnScore: number = 0;
//   public tempScore: number = 0;

//   public get frozenDice(): DiceArray {
//     return this.dice.allDice.filter(
//       (d) =>
//         this._dieStates[d.id] === true ||
//         this._tmp_frozen[d.id] === true
//     );
//   }
//   public get unfrozenDice(): DiceArray {
//     return this.dice.allDice.filter(
//       (d) =>
//         this._dieStates[d.id] === false && 
//         this._tmp_frozen[d.id] === false
//     );
//   }
//   public get state() {
//     return this.stateService.state.value;
//   }

//   constructor(dice: GameDice, player: Player) {
//     this.dice = dice;
//     this._dieStates = this._initialDiceStates
//     this._tmp_frozen = this._initialDiceStates
//     this.player = player;
//     this.roll$ = this.dice.roll$;
//     this.state$ = from(this.stateService.start() as ObservableInput<any>);
//     this.freeze$ = new Subject()
//     this.frozeN = new Subject()
//     this.score$ = new Subject()

//     this.roll$.subscribe(roll => {
//       this.commitFreeze();
//       // check if a valid move exists
//       this.stateService.send('ROLL');
//       if (!FarkleLogic.doesValidMoveExist(this.unfrozenDice)) {
//         console.log('Farkle!', this.unfrozenDice.map(d => d.value));
//         this.stateService.send('FARKLE');
//         this.tempScore = 0
//         this.turnScore = 0;
//         // Don't auto end turn
//         // this.end()
//       }
//     })

//     this.freeze$.subscribe(freezeId => {
//       // TODO - prevent freezing a die if it's not part of a valid move
//       if (!!this._tmp_frozen[freezeId]) {
//         this._tmp_frozen[freezeId] = false;
//       } else {
//         this._tmp_frozen[freezeId] = true;
//       }

//       const _tmp_frozen_arr = this.dice.allDice.filter(
//         (d) => this._tmp_frozen[d.id] === true
//       );
      
//       if (FarkleLogic.isValidMove(_tmp_frozen_arr)) {
//         this.stateService.send('VALID_MOVE');
//         this.tempScore = this.turnScore + FarkleLogic.scoreMove(
//           this.dice.allDice.filter((d) => this._tmp_frozen[d.id] === true)
//         );
//       } else {
//         this.stateService.send('INVALID_MOVE');
//       }

//       this.frozeN.next(this.frozenDice);
//     })

    
//   }

//   rollDice() {
//     if (this.state === 'start' || this.state === 'ready') {
//       if (this.unfrozenDice.length > 0) {
//         this.dice.roll(this.unfrozenDice);
//       } else {
//         // rolling all
//         this.commitFreeze();
//         this._dieStates = this._initialDiceStates;
//         this.dice.rollAll();
//       }
//     } else {
//       console.log('Need to be in "rolling" state', this.state);
//     }
//   }

//   freezeDie(id: number) {
//     if (this.state === 'observing' || this.state === 'ready') {
//       // console.log('Freezing die number ', id)
//       this.freeze$.next(id)
//     } else {
//       console.log('Need to be able to freeze', this.state)
//     }
//   }

//   commitFreeze(){
//     this._tmp_frozen.forEach(
//       (v, i) => (this._dieStates[i] = v || this._dieStates[i])
//     ); // commit freeze states

//     this.turnScore += FarkleLogic.scoreMove(
//       this.dice.allDice.filter((d) => this._tmp_frozen[d.id] === true)
//     );

//     this.frozeN.next(this.frozenDice);
//     this._tmp_frozen = this._initialDiceStates;
//   }

//   end() {
//     // emit player score
//     if (this.state === 'ready' || this.state === 'farkle') {
//       if (this.state === 'ready' && this.player.score === 0 && this.tempScore < 1000) {
//         console.log("Must score at least 1000 on your first turn")
//       } else {
//         this.commitFreeze()
//         console.log('Ending turn')
//         this.stateService.send('END')
//         this.score$.next(this.turnScore)
//         this.score$.complete()
//         this.freeze$.complete()
//         this.frozeN.complete()
//       }
//     } else {
//       console.log('Can\'t end turn')
//     }
//   }

//   private get _initialDiceStates() {
//     return new Array(6).fill(false) 
//   }

// }
