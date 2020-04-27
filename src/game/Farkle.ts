import { Machine, assign } from 'xstate';
import {
  turnStates,
  turnGuards,
  turnActions,
} from './Turn';
import { DiceValueArray } from './Die';

export type gameContext = {
  countPlayers: number;
  player: number;
  dice: DiceValueArray;
  scores: Array<number>;
  frozen: Array<boolean>;
  frozenThisRoll: Array<boolean>;
  turnScore: number;
  scoreThisRoll: number;
  _firstTo10k: number
  winner: null | number
};

export type gameEvent = 
  | {type: 'START'}
  | {type: 'ROLL'}
  | {type: 'FREEZE'; dieId: number}
  | {type: 'END_TURN'}
  | {type: 'END'}


export const createFarkleGame = (countPlayers: number) => {
  const playerStates: {[key: string]: any} = {};
  for (let i = 0; i < countPlayers; i++) {
    const next = i + 1 < countPlayers ? i + 1 : 0;
    playerStates[`player-${i}`] = {
      initial: 'start',
      states: turnStates,
      on: {
        TURN_ENDED: [
          {
            target: `player-${next}`,
            actions: [
              'setIsFinalRound',
              'incrementPlayer'
            ],
            cond: 'gameIsNotOver',
          },
          {
            target: 'end_game'
          }
        ],
      },
    };
  }

  return Machine<gameContext, gameEvent>(
    {
      id: 'farkle-game',
      initial: 'idle',
      context: {
        countPlayers,
        player: 0,
        dice: new Array(6).fill(0),
        scores: new Array(countPlayers).fill(0),
        frozen: new Array(6).fill(false),
        frozenThisRoll: new Array(6).fill(false),
        turnScore: 0,
        scoreThisRoll: 0,
        winner: null,
        _firstTo10k: -1,
      },
      states: {
        idle: {
          on: {
            START: 'player-0',
          },
        },
        ...playerStates,
        end_game: {
          entry: 'setWinner',
          type: 'final',
        },
      },
    },
    {
      guards: {
        ...turnGuards,
        gameIsNotOver: (c, e) => {
          const isGameOver = (
            c._firstTo10k >= 0 && c.player === c._firstTo10k - 1
          )
          console.log(isGameOver, c._firstTo10k, c.player);
          return !isGameOver
        },
      },

      actions: {
        ...turnActions,
        incrementPlayer: assign({
          player: (c, _e) => {
            return c.player + 1 < c.countPlayers ? c.player + 1 : 0;
          },
        }),
        setIsFinalRound: assign({
          _firstTo10k: (c,e) => c.scores.findIndex(s => s >= 1000)
        }),
        setWinner: assign({
          winner: (c,e) => {
            return c.scores.indexOf(Math.max(...c.scores))
          }
        })
      },
    }
  );
};

// export class FarkleGame {

//   public gameDice:GameDice;
//   readonly Players:Array<Player> = []
//   private _currentPlayerId: number;
//   private turnStateSub: Subscription | undefined;

//   private scoreSubs: Array<Subscription> = [];
//   private firstTo10k: number = -1;
//   public isStarted: boolean = false
//   public isEnded: boolean = false

//   get scores() {
//     return this.Players.map(p => p.score)
//   }

//   get currentTurn() {
//     return this.currentPlayer.currentTurn
//   }

//   get currentPlayer() {
//     return this.Players[this._currentPlayerId];
//   }

//   public getWinner(): Player {
//     const maxScore = Math.max(...this.scores)
//     return this.Players.find(p => p.score === maxScore) as Player
//   }
  
//   /**
//    * Creates an instance of FarkleGame.
//    */
//   constructor(countPlayers: number) {
//     console.log('New Game', this)
//     if (countPlayers < 2 || countPlayers > 4) {
//       throw new Error('Must be between 2 & 4 players')
//     } 
//     this.gameDice = new GameDice()
//     this.initPlayers(countPlayers)
//     this._currentPlayerId = 0
//   }

//   private initPlayers(count: number) {
//     for (let i = 0; i < count; i++) {
//       this.Players.push(new Player(i));
//       this.scoreSubs.push(this.Players[i].totalScore$.subscribe(score => {
//         // do something when a player's total score updates
//         if (score >= FarkleLogic.END_GAME_POINTS) {
//           this.firstTo10k = i;
//           console.log('First to 10k', this.firstTo10k);
//         }
//       }))
//     }
//   }

//   private startTurn() {
//     if (this._currentPlayerId === this.firstTo10k) {
//       this.endGame()
//     }
//     this.currentPlayer.startTurn(this.gameDice);
//     this.turnStateSub = this.currentTurn?.state$.subscribe(
//       null, 
//       null, 
//       () => {
//         this.prepareNextTurn();
//         this.startTurn();
//     });
//   }

//   private prepareNextTurn(){
//     // console.log('nextTurn');
//     this.turnStateSub?.unsubscribe()
//     this._currentPlayerId++;
//     this._currentPlayerId = this._currentPlayerId % this.Players.length;
//   }

//   private endGame() {
//     console.log('End game')
//     const winner = this.getWinner()
//     console.log(`The winner is Player ${winner.id + 1} with ${winner.score} points`);
//     this.isEnded = true
//     this.scoreSubs.forEach(sub => sub.unsubscribe())
//   }
//   // -------- User Actions --------
//   public startGame() {
//     this.isStarted = true
//     this._currentPlayerId = 0
//     this.startTurn()
//   }

//   public roll(){
//     this.currentPlayer.nextRoll()
//   }
  
//   public freezeDie(dieId: number){
//     this.currentPlayer.freezeDie(dieId)
//   }

//   public endTurn() {
//     console.log('End turn')
//     this.currentPlayer.endTurn()
//   }
// }
