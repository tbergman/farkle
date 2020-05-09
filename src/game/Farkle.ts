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
  | {type: 'SET_DICE'; values: DiceValueArray}
  | {type: 'FREEZE'; dieId: number}
  | {type: 'END_TURN'}
  | {type: 'END'};


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
