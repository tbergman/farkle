// import { DiceArray } from "./GameDice";
import { DieValue, DiceValueArray } from "./Die";

const countIf = (arr: Array<any>, callback: Function):number => {
  return arr.filter((x) => callback(x)).length
}
 
export class FarkleLogic {
  
  static DICE_COUNT = 6
  static DICE_VALUES = [1, 2, 3, 4, 5, 6]
  static FIVE_SCORE = 50;
  static ONE_SCORE = 100;
  static STRAIGHT_SCORE = 1000;
  static THREE_PAIR_SCORE = 1000;
  static REQUIRED_POINTS_ON_BOARD = 1000;
  static END_GAME_POINTS = 10000;
  static MAX_PLAYERS = 6;
  static BOT_MIN_SCORE = 300;

  
  static scoreMove(_dice: DiceValueArray): number {
    let score = 0;
    if (!FarkleLogic.isValidMove(_dice)) {
      return 0;
    } else {
      if (FarkleLogic.isStraight(_dice)) {
        return FarkleLogic.STRAIGHT_SCORE;
      } else if (FarkleLogic.isThreePairs(_dice)) {
        return FarkleLogic.THREE_PAIR_SCORE;
      }
      /// score triples
      const triples = FarkleLogic.getFaceValuesOfTriples(_dice);
      if (!!triples.length) {
        for (let t of triples) {
          const baseScore = t === 1 ? 1000 : t * 100;
          const countVals = _dice.filter((val) => val === t).length;
          if (countVals > 3) {
            const additionalScore = (countVals - 3) * baseScore;
            score += baseScore + additionalScore;
          } else {
            score += baseScore;
          }
        }
      }

      if (!triples.length || !triples.includes(1)) {
        const ones = _dice.filter((v) => v === 1).length;
        score += ones * FarkleLogic.ONE_SCORE;
      }

      if (!triples.length || !triples.includes(5)) {
        const fives = _dice.filter((v) => v === 5).length;
        score += fives * FarkleLogic.FIVE_SCORE;
      }
    }
    return score;
  }

  static doesValidMoveExist(_diceToCheck: DiceValueArray):boolean {
    const validValues = [1, 5];
    const diceValues = _diceToCheck.map((die) => die);
    validValues.push(...FarkleLogic.getFaceValuesOfTriples(diceValues));
    return (
      FarkleLogic.isStraight(diceValues) ||
      FarkleLogic.isThreePairs(diceValues) ||
      diceValues.some((value) => validValues.includes(value))
    );
  }

  static getBestScoringMove(_diceToCheck: DiceValueArray): DiceValueArray {
    if (!FarkleLogic.doesValidMoveExist(_diceToCheck)) return []
    if (FarkleLogic.isStraight(_diceToCheck) || FarkleLogic.isThreePairs(_diceToCheck)) {
      return _diceToCheck
    }
    const triples = FarkleLogic.getFaceValuesOfTriples(_diceToCheck)
    const scoringVals = [1, 5, ...triples];
    return _diceToCheck.filter((d) => scoringVals.includes(d));
  }

  static isValidMove(_diceToCheck: DiceValueArray): boolean {
    const validValues = [1, 5];
    validValues.push(...FarkleLogic.getFaceValuesOfTriples(_diceToCheck));

    return (
      FarkleLogic.isStraight(_diceToCheck) ||
      FarkleLogic.isThreePairs(_diceToCheck) ||
      _diceToCheck.every((value) => validValues.includes(value))
    );
  }

  static canEndTurn(frozenDice: DiceValueArray, currentScore: number, turnScore: number) {
    const isValidMove = FarkleLogic.isValidMove(frozenDice)
    return (
      isValidMove &&
      (
        currentScore >= FarkleLogic.REQUIRED_POINTS_ON_BOARD ||
        turnScore >= FarkleLogic.REQUIRED_POINTS_ON_BOARD
      )
    );
  }

  // static DiceArrayFromValues(_values: DiceValueArray): DiceArray {
  //   return _values.map(_val => new Die(-1, _val))
  // }

  static isStraight(_dice: DiceValueArray): boolean {
    if (_dice.length !== FarkleLogic.DICE_COUNT) return false;
    return FarkleLogic.DICE_VALUES.every(_val => {
      return countIf(_dice, (d: number) => d === _val) === 1;
    })
  }

  static isThreePairs(_dice: DiceValueArray):boolean {
    if (_dice.length !== FarkleLogic.DICE_COUNT) return false;
    return FarkleLogic.DICE_VALUES.every(_val => {
      const countVals = countIf(_dice, (d:number) => d === _val)
      return countVals === 0 || countVals === 2
    })
  }

  static getFaceValuesOfTriples(_dice: DiceValueArray): DiceValueArray {
    const tripleValues: DiceValueArray = [];
    for (let val of _dice) {
      if (tripleValues.includes(val)) continue;
      if (FarkleLogic.isPartOfTriples(val, _dice)) {
        tripleValues.push(val);
      }
    }
    return tripleValues;
  }

  static isPartOfTriples(value: DieValue, _dice: DiceValueArray): boolean {
    if (_dice.length < 3) return false;
    const countOfValue = countIf(_dice, (d:number) => d === value);
    if (countOfValue >= 3) {
      return true;
    } else return false;
  }
}