import { Machine, interpret } from "xstate";
import { Player } from "./Player";
import { GameDice, DiceArray } from "./GameDice";
import { Subject, from, Observable, ObservableInput } from "rxjs";
// import { tap } from "rxjs/operators";
import {FarkleLogic} from './FarkleLogic';


/**
 *
 *
 */
export class Turn {
  readonly turnStateMachine = Machine({
    id: 'turn',
    initial: 'start',
    states: {
      start: {
        on: {
          ROLL: 'observing'
        }
      },
      ready: {
        on: {
          VALID_MOVE: 'ready',
          INVALID_MOVE: 'observing',
          ROLL: 'observing',
          END: 'end',
        },
      },
      observing: {
        on: {
          VALID_MOVE: 'ready',
          INVALID_MOVE: 'observing',
          FARKLE: 'farkle',
        },
      },
      farkle: {
        on: {
          END: 'end'
        }
      },
      end: {
        type: 'final',
      },
    },
  });
  readonly stateService = interpret(this.turnStateMachine)
    .onTransition((state) => console.log('Set state:', state.value));
  readonly player: Player;
  readonly dice: GameDice;
  private roll$: Subject<DiceArray>;
  public state$:Observable<any>;
  public frozeN: Subject<DiceArray>;
  private freeze$: Subject<number>;
  score$: Subject<number>;
  private _dieStates: Array<boolean>;
  private _tmp_frozen: Array<boolean>;
  public turnScore: number = 0;
  public tempScore: number = 0;

  public get frozenDice(): DiceArray {
    return this.dice.allDice.filter(
      (d) =>
        this._dieStates[d.id] === true ||
        this._tmp_frozen[d.id] === true
    );
  }
  public get unfrozenDice(): DiceArray {
    return this.dice.allDice.filter(
      (d) =>
        this._dieStates[d.id] === false && 
        this._tmp_frozen[d.id] === false
    );
  }
  public get state() {
    return this.stateService.state.value;
  }

  constructor(dice: GameDice, player: Player) {
    this.dice = dice;
    this._dieStates = this._initialDiceStates
    this._tmp_frozen = this._initialDiceStates
    this.player = player;
    this.roll$ = this.dice.roll$;
    this.state$ = from(this.stateService.start() as ObservableInput<any>);
    this.freeze$ = new Subject()
    this.frozeN = new Subject()
    this.score$ = new Subject()

    this.roll$.subscribe(roll => {
      this.commitFreeze();
      // check if a valid move exists
      this.stateService.send('ROLL');
      if (!FarkleLogic.doesValidMoveExist(this.unfrozenDice)) {
        console.log('Farkle!', this.unfrozenDice.map(d => d.value));
        this.stateService.send('FARKLE');
        this.tempScore = 0
        this.turnScore = 0;
        // Don't auto end turn
        // this.end()
      }
    })

    this.freeze$.subscribe(freezeId => {
      // TODO - prevent freezing a die if it's not part of a valid move
      if (!!this._tmp_frozen[freezeId]) {
        this._tmp_frozen[freezeId] = false;
      } else {
        this._tmp_frozen[freezeId] = true;
      }

      const _tmp_frozen_arr = this.dice.allDice.filter(
        (d) => this._tmp_frozen[d.id] === true
      );
      
      if (FarkleLogic.isValidMove(_tmp_frozen_arr)) {
        this.stateService.send('VALID_MOVE');
        this.tempScore = this.turnScore + FarkleLogic.scoreMove(
          this.dice.allDice.filter((d) => this._tmp_frozen[d.id] === true)
        );
      } else {
        this.stateService.send('INVALID_MOVE');
      }

      this.frozeN.next(this.frozenDice);
    })

    
  }

  rollDice() {
    if (this.state === 'start' || this.state === 'ready') {
      if (this.unfrozenDice.length > 0) {
        this.dice.roll(this.unfrozenDice);
      } else {
        // rolling all
        this.commitFreeze();
        this._dieStates = this._initialDiceStates;
        this.dice.rollAll();
      }
    } else {
      console.log('Need to be in "rolling" state', this.state);
    }
  }

  freezeDie(id: number) {
    if (this.state === 'observing' || this.state === 'ready') {
      // console.log('Freezing die number ', id)
      this.freeze$.next(id)
    } else {
      console.log('Need to be able to freeze', this.state)
    }
  }

  commitFreeze(){
    this._tmp_frozen.forEach(
      (v, i) => (this._dieStates[i] = v || this._dieStates[i])
    ); // commit freeze states

    this.turnScore += FarkleLogic.scoreMove(
      this.dice.allDice.filter((d) => this._tmp_frozen[d.id] === true)
    );

    this.frozeN.next(this.frozenDice);
    this._tmp_frozen = this._initialDiceStates;
  }

  end() {
    // emit player score
    if (this.state === 'ready' || this.state === 'farkle') {
      if (this.state === 'ready' && this.player.score === 0 && this.tempScore < 1000) {
        console.log("Must score at least 1000 on your first turn")
      } else {
        this.commitFreeze()
        console.log('Ending turn')
        this.stateService.send('END')
        this.score$.next(this.turnScore)
        this.score$.complete()
        this.freeze$.complete()
        this.frozeN.complete()
      }
    } else {
      console.log('Can\'t end turn')
    }
  }

  private get _initialDiceStates() {
    return new Array(6).fill(false) 
  }

}
