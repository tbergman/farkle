import { DiceArray } from "./GameDice";
import { Die, DieValue, DiceValueArray } from "./Die";

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
  static REQUIRED_POINTS_ON_BOARD = 1000
  static END_GAME_POINTS = 10000
  
  static scoreMove(_dice: DiceArray): number {
    const values = _dice.map((d) => d.value);
    let score = 0;
    if (!FarkleLogic.isValidMove(_dice)) {
      return 0;
    } else {
      if (FarkleLogic.isStraight(values)) {
        return FarkleLogic.STRAIGHT_SCORE;
      } else if (FarkleLogic.isThreePairs(values)) {
        return FarkleLogic.THREE_PAIR_SCORE;
      }
      /// score triples
      const triples = FarkleLogic.getFaceValuesOfTriples(values);
      if (!!triples.length) {
        for (let t of triples) {
          const baseScore = t === 1 ? 1000 : t * 100;
          const countVals = values.filter((val) => val === t).length;
          if (countVals > 3) {
            const additionalScore = (countVals - 3) * baseScore;
            score += baseScore + additionalScore;
          } else {
            score += baseScore;
          }
        }
      }

      if (!triples.length || !triples.includes(1)) {
        const ones = values.filter((v) => v === 1).length;
        score += ones * FarkleLogic.ONE_SCORE;
      }

      if (!triples.length || !triples.includes(5)) {
        const fives = values.filter((v) => v === 5).length;
        score += fives * FarkleLogic.FIVE_SCORE;
      }
    }
    return score;
  }

  static doesValidMoveExist(_diceToCheck: DiceArray):boolean {
    const validValues = [1, 5];
    const diceValues = _diceToCheck.map((die) => die.value);
    validValues.push(...FarkleLogic.getFaceValuesOfTriples(diceValues));
    return (
      FarkleLogic.isStraight(diceValues) ||
      FarkleLogic.isThreePairs(diceValues) ||
      diceValues.some((value) => validValues.includes(value))
    );
  }

  static getBestScoringMove(_diceToCheck: DiceArray): DiceArray {
    if (!FarkleLogic.doesValidMoveExist(_diceToCheck)) return []
    
    const _vals = _diceToCheck.map(d => d.value)
    if (FarkleLogic.isStraight(_vals) || FarkleLogic.isThreePairs(_vals)) {
      return _diceToCheck
    }
    const triples = FarkleLogic.getFaceValuesOfTriples(_vals)
    const scoringVals = [1, 5, ...triples];
    return _diceToCheck.filter((d) => scoringVals.includes(d.value));
  }

  static isValidMove(_diceToCheck: DiceArray): boolean {
    const validValues = [1, 5];
    const diceValues = _diceToCheck.map((die) => die.value);
    validValues.push(...FarkleLogic.getFaceValuesOfTriples(diceValues));

    return (
      FarkleLogic.isStraight(diceValues) ||
      FarkleLogic.isThreePairs(diceValues) ||
      diceValues.every((value) => validValues.includes(value))
    );
  }

  static DiceArrayFromValues(_values: Array<DieValue>): DiceArray {
    return _values.map(_val => new Die(-1, _val))
  }

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