import { FarkleGame } from "../Farkle";
import { Player } from "../Player";
import { FarkleLogic } from "../FarkleLogic";
import { Die } from "../Die";
import { Turn } from "../Turn";

export class FarkleSim {
  public Game: FarkleGame;

  constructor(game: FarkleGame){
    this.Game = game
  }
  
  start(){
    this.Game.startGame()
    this.playTurn(this.Game.currentPlayer)
  }

  private playTurn(player:Player) {
    const turn = player.currentTurn as Turn
    let diceToFreeze: Array<Die> = []
    turn.state$.subscribe(state => {
      switch (state.value) {
        case 'start':
          diceToFreeze = []
          this.Game.roll();
          break;
        case 'observing':
          if (diceToFreeze.length === 0) {
            console.log('Roll was', turn.unfrozenDice.map(d => d.value)); 
            if (FarkleLogic.doesValidMoveExist(turn.unfrozenDice)) {
              diceToFreeze = FarkleLogic.getBestScoringMove(turn.unfrozenDice);
              console.log('Going to freeze', diceToFreeze.map(d => d.value))
              const nextFreeze = diceToFreeze.pop()
              if (nextFreeze) turn.freezeDie(nextFreeze.id)
            } // else Farkle!
          } else {
            const nextFreeze = diceToFreeze.pop()
            if (nextFreeze) this.Game.freezeDie(nextFreeze.id);
          }
          break;

        case 'ready':
          if(diceToFreeze.length === 0) {
            // turn end logic here
            if (turn.unfrozenDice.length <= 3 && turn.turnScore > 350) {
              this.Game.endTurn()
            } else this.Game.roll()
          } else {
            const nextFreeze = diceToFreeze.pop();
            if (nextFreeze) this.Game.freezeDie(nextFreeze.id);
          }
          break
        case 'farkle':
        case 'end':
          console.log(
            'Roll was',
            turn.unfrozenDice.map((d) => d.value)
          );
          this.Game.endTurn()
          break;
        default:
          break;
      }
    })
  }

}
// Game.startGame();
