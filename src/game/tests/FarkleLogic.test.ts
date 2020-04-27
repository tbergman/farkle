import { FarkleLogic } from "../FarkleLogic"
import { DiceValueArray } from "../Die";

test('Computes Straits', () => {
  expect(FarkleLogic.isStraight([1,2,3,4,5,6])).toBeTruthy()
  expect(FarkleLogic.isStraight([1,2,3,4,5])).toBeFalsy()
  expect(FarkleLogic.isStraight([1,1,1,1,1,1])).toBeFalsy()
  expect(FarkleLogic.isStraight([])).toBeFalsy()
})

test('Computes 3 Pairs', () => {
  expect(FarkleLogic.isThreePairs([1, 2, 3, 1, 2, 3])).toBeTruthy();
  expect(FarkleLogic.isThreePairs([1, 2, 3, 4, 5, 5])).toBeFalsy();
  expect(FarkleLogic.isThreePairs([1, 2, 1, 2, 1, 2])).toBeFalsy();
  expect(FarkleLogic.isThreePairs([1, 1, 1, 1, 1, 1])).toBeFalsy();
  expect(FarkleLogic.isThreePairs([1, 2, 3, 4, 5, 6])).toBeFalsy();
  expect(FarkleLogic.isThreePairs([1, 2, 3, 4, 5])).toBeFalsy();
  expect(FarkleLogic.isThreePairs([])).toBeFalsy();
});

test('is Part of Triples', () => {
  expect(FarkleLogic.isPartOfTriples(1, [1, 2, 3, 4, 5, 6])).toBeFalsy();
  expect(FarkleLogic.isPartOfTriples(1, [1, 2, 3, 1, 2, 3])).toBeFalsy();
  expect(FarkleLogic.isPartOfTriples(1, [1, 2, 1, 2, 1, 2])).toBeTruthy();
  expect(FarkleLogic.isPartOfTriples(2, [1, 2, 1, 2, 1, 2])).toBeTruthy();
  expect(FarkleLogic.isPartOfTriples(3, [1, 2, 1, 2, 1, 2])).toBeFalsy();
  expect(FarkleLogic.isPartOfTriples(1, [1, 1, 1])).toBeTruthy();
  expect(FarkleLogic.isPartOfTriples(1, [1, 1])).toBeFalsy();
  expect(FarkleLogic.isPartOfTriples(1, [])).toBeFalsy();
});

test('getFaceValuesOfTriples', () => {
  expect(FarkleLogic.getFaceValuesOfTriples([1, 2, 3, 4, 5, 6])).toEqual([]);
  expect(FarkleLogic.getFaceValuesOfTriples([1, 2, 3, 1, 2, 3])).toEqual([]);
  expect(FarkleLogic.getFaceValuesOfTriples([1, 2, 1, 2, 1, 2])).toEqual([1,2]);
  expect(FarkleLogic.getFaceValuesOfTriples([1, 1, 1])).toEqual([1]);
  expect(FarkleLogic.getFaceValuesOfTriples([1, 1])).toEqual([]);
  expect(FarkleLogic.getFaceValuesOfTriples([])).toEqual([]);
});

test('Valid move exists', () => {
  expect(FarkleLogic.doesValidMoveExist(
    [1,2,3,4,5,6])
  ).toBeTruthy()
  expect(FarkleLogic.doesValidMoveExist(
    [1,2,3,4,6,6])
  ).toBeTruthy()
  expect(FarkleLogic.doesValidMoveExist(
    [2,2,3,3,4,6])
  ).toBeFalsy()
  expect(FarkleLogic.doesValidMoveExist(
    [1])
  ).toBeTruthy()
  expect(FarkleLogic.doesValidMoveExist(
    [2])
  ).toBeFalsy()
  expect(FarkleLogic.doesValidMoveExist(
    [2,2])
  ).toBeFalsy()
  expect(FarkleLogic.doesValidMoveExist(
    [2,2,2])
  ).toBeTruthy()
  expect(FarkleLogic.doesValidMoveExist(
    [2,2,3,3,4,4])
  ).toBeTruthy()
  expect(FarkleLogic.doesValidMoveExist(
    [])
  ).toBeFalsy()
})

test('scoreMove', () => {
  expect(
    FarkleLogic.scoreMove(
      [1, 2, 3, 4, 5, 6]))
  .toEqual(1000);
  
  expect(
    FarkleLogic.scoreMove(
      [1, 2, 1, 2, 1, 2]))
  .toEqual(1200);
  
  expect(
    FarkleLogic.scoreMove(
      [1, 2, 3, 1, 2, 3]))
  .toEqual(1000);
  
  expect(
    FarkleLogic.scoreMove(
      [5, 5, 5, 1, 2, 3]))
  .toEqual(0);
  
  expect(
    FarkleLogic.scoreMove(
      [5, 5, 5, 1]))
  .toEqual(600);
});

test('Best scoring move', () => {
  expect(FarkleLogic.getBestScoringMove([5, 5, 5, 3, 3, 3])).toEqual(
    [5, 5, 5, 3, 3, 3]
  );
  expect(FarkleLogic.getBestScoringMove([2, 5, 5, 3, 3, 3])).toEqual(
    [5, 5, 3, 3, 3]
  );
  expect(FarkleLogic.getBestScoringMove([2, 6, 4, 3, 3, 3])).toEqual(
    [3, 3, 3]
  );
  expect(FarkleLogic.getBestScoringMove([1, 5, 1, 5, 1, 5])).toEqual(
    [1,5,1,5,1,5]
  );
  expect(FarkleLogic.getBestScoringMove([2, 3, 4, 4, 6])).toEqual(
    []
  );
  expect(FarkleLogic.getBestScoringMove([1])).toEqual(
    [1]
  );
  expect(FarkleLogic.getBestScoringMove([])).toEqual(
    []
  );
})
