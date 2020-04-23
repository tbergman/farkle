import { GameDice } from "./GameDice";
import { Turn } from "./Turn";
import { Subject, Subscription } from "rxjs";

/**
 *
 *
 */
export class Player {
  public id: number;
  public currentTurn: Turn | undefined;
  private turnScoreSub: Subscription | undefined;
  private turnStateSub: Subscription | undefined;
  
  public score: number = 0;
  public totalScore$: Subject<number>;

  get turnState$() {
    return this.currentTurn ? this.currentTurn.state$ : new Subject();
  }

  constructor(id: number) {
    this.id = id;
    this.totalScore$ = new Subject()
  }

  public startTurn(dice: GameDice) {
    console.log(`Player ${this.id + 1} starting turn`)
    this.currentTurn = new Turn(dice, this);

    this.turnScoreSub = this.currentTurn.score$.subscribe(score => {
      console.log(`Player ${this.id + 1} scored ${score}`);
      this.score += score;
      this.totalScore$.next(this.score)
      console.log(`Total score is ${this.score}`);
    }, null, () => {
      this.cleanupTurn();
    })
  }

  freezeDie(i: number) {
    this.currentTurn?.freezeDie(i)
  }

  nextRoll() {
    this.currentTurn?.rollDice();
  }

  public endTurn() {
    this.currentTurn?.end();
  }

  private cleanupTurn() {
    delete this.currentTurn;
    this.turnScoreSub?.unsubscribe();
    this.turnStateSub?.unsubscribe();
  }
}
