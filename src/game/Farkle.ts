import { Machine, assign, StateMachine } from 'xstate';
import {
  turnStates,
  turnGuards,
  turnActions,
} from './Turn';
import { DiceValueArray } from './Die';
import { FarkleLogic } from './FarkleLogic';
import { Player } from './player';


export type gameContext = {
  players: Array<Player>,
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
  | {type: 'START', players: Array<Player>}
  | {type: 'ROLL'}
  | {type: 'SET_DICE'; values: DiceValueArray}
  | {type: 'FREEZE'; dieId: number}
  | {type: 'END_TURN'}
  | {type: 'END'};

export type gameMachine = StateMachine<gameContext, any, gameEvent>

export const createFarkleGame = (players: Array<Player>) => {
  const countPlayers = players.length
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
        players,
        player: 0,
        dice: new Array(6).fill(0),
        scores: new Array(players.length).fill(0),
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
          const next_player = (c.player + 1) % c.players.length
          const isGameOver = (
            c._firstTo10k >= 0 && next_player === c._firstTo10k
          )
          // console.log(`First to 10k: ${c._firstTo10k}, next player: ${next_player}, isGameOver? ${isGameOver}`)

          return !isGameOver
        },
      },

      actions: {
        ...turnActions,
        incrementPlayer: assign({
          player: (c, _e) => {
            return c.player + 1 < c.players.length ? c.player + 1 : 0;
          },
        }),
        setIsFinalRound: assign({
          _firstTo10k: (c,e) => c.scores.findIndex(s => s >= FarkleLogic.END_GAME_POINTS)
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
