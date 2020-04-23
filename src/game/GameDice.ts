import { Die } from "./Die";
import { Subject } from "rxjs";

/**
 *
 *
 */
export type DiceArray = Array<Die>;
export class GameDice {
  private _allDice: DiceArray = [];
  public roll$: Subject<DiceArray>;

  get allDice() {
    return this._allDice;
  }
  get values() {
    return this._allDice.map((d) => d.value);
  }
  get ids() {
    return this._allDice.map((_, i) => i);
  }

  dieWithId(id: number): Die {
    return this._allDice.find((die) => die.id === id) as Die;
  }

  constructor(count: number = 6) {
    for (let i = 0; i < count; i++) {
      this._allDice.push(new Die(i));
    }
    this.roll$ = new Subject();
  }

  roll(diceToRoll: DiceArray) {
    for (let die of diceToRoll) {
      die.roll();
    }
    // console.log('Roll', this.allDice)
    this.roll$.next(this._allDice);
  }

  rollAll() {
    this.roll(this._allDice);
  }
}
