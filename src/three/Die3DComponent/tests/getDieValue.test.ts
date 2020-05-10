import { getDieValue } from "../getDieValue"
import { round } from "../../../util/round";
import { initialConditions } from "../initialConditions";
import { rotationToValueMap } from "../rotationToValueMap";

const pi = Math.PI
test('Should return the right values', () => {
  for (let map of rotationToValueMap) {
    const rotation: Array<number> = map[0].split(',')
    expect(getDieValue(rotation)).toEqual(map[1])
  }
})