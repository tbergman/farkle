import { round } from "../../util/round"
const rotationToValueMap = new Map()
const mapPrecision = 2
const pi = round(Math.PI, mapPrecision)
// ------------ z = 0 ------------ //
// ----- y = 0 ----- //
rotationToValueMap.set([0, 0, 0].toString(), 1)
rotationToValueMap.set([pi, 0, 0].toString(), 6)
rotationToValueMap.set([-pi, 0, 0].toString(), 6)
rotationToValueMap.set([pi/2, 0, 0].toString(), 2)
rotationToValueMap.set([-pi/2, 0, 0].toString(), 5)
// ----- y = pi ----- //
rotationToValueMap.set([0, pi, 0].toString(), 6)
rotationToValueMap.set([pi, pi, 0].toString(), 1)
rotationToValueMap.set([-pi, pi, 0].toString(), 1)
rotationToValueMap.set([pi/2, pi, 0].toString(), 5)
rotationToValueMap.set([-pi/2, pi, 0].toString(), 2)
// ----- y = -pi ----- //
rotationToValueMap.set([0, -pi, 0].toString(), 6)
rotationToValueMap.set([pi, -pi, 0].toString(), 1)
rotationToValueMap.set([-pi, -pi, 0].toString(), 1)
rotationToValueMap.set([pi/2, -pi, 0].toString(), 5)
rotationToValueMap.set([-pi/2, -pi, 0].toString(), 2)
// ----- y = pi/2 ----- //
rotationToValueMap.set([0, pi/2, 0].toString(), 4)
rotationToValueMap.set([pi, pi/2, 0].toString(), 4)
rotationToValueMap.set([-pi, pi/2, 0].toString(), 4)
rotationToValueMap.set([pi/2, pi/2, 0].toString(), 4)
rotationToValueMap.set([-pi/2, pi/2, 0].toString(), 4)
// ----- y = -pi/2 ----- //
rotationToValueMap.set([0, -pi/2, 0].toString(), 3)
rotationToValueMap.set([pi, -pi/2, 0].toString(), 3)
rotationToValueMap.set([-pi, -pi/2, 0].toString(), 3)
rotationToValueMap.set([pi/2, -pi/2, 0].toString(), 3)
rotationToValueMap.set([-pi/2, -pi/2, 0].toString(), 3)

// ------------ z = pi ------------ //
// ----- y = 0 ----- //
rotationToValueMap.set([0, 0, pi].toString(), 1)
rotationToValueMap.set([pi, 0, pi].toString(), 6)
rotationToValueMap.set([-pi, 0, pi].toString(), 6)
rotationToValueMap.set([pi/2, 0, pi].toString(), 2)
rotationToValueMap.set([-pi/2, 0, pi].toString(), 5)
// ----- y = pi ----- //
rotationToValueMap.set([0, pi, pi].toString(), 6)
rotationToValueMap.set([pi, pi, pi].toString(), 1)
rotationToValueMap.set([-pi, pi, pi].toString(), 1)
rotationToValueMap.set([pi/2, pi, pi].toString(), 5)
rotationToValueMap.set([-pi/2, pi, pi].toString(), 2)
// ----- y = -pi ----- //
rotationToValueMap.set([0, -pi, pi].toString(), 6)
rotationToValueMap.set([pi, -pi, pi].toString(), 1)
rotationToValueMap.set([-pi, -pi, pi].toString(), 1)
rotationToValueMap.set([pi/2, -pi, pi].toString(), 5)
rotationToValueMap.set([-pi/2, -pi, pi].toString(), 2)
// ----- y = pi/2 ----- //
rotationToValueMap.set([0, pi/2, pi].toString(), 3)
rotationToValueMap.set([pi, pi/2, pi].toString(), 3)
rotationToValueMap.set([-pi, pi/2, pi].toString(), 3)
rotationToValueMap.set([pi/2, pi/2, pi].toString(), 3)
rotationToValueMap.set([-pi/2, pi/2, pi].toString(), 3)
// ----- y = -pi/2 ----- //
rotationToValueMap.set([0, -pi/2, pi].toString(), 4)
rotationToValueMap.set([pi, -pi/2, pi].toString(), 4)
rotationToValueMap.set([-pi, -pi/2, pi].toString(), 4)
rotationToValueMap.set([pi/2, -pi/2, pi].toString(), 4)
rotationToValueMap.set([-pi/2, -pi/2, pi].toString(), 4)

// ------------ z = -pi ------------ //
// ----- y = 0 ----- //
rotationToValueMap.set([0, 0, -pi].toString(), 1)
rotationToValueMap.set([pi, 0, -pi].toString(), 6)
rotationToValueMap.set([-pi, 0, -pi].toString(), 6)
rotationToValueMap.set([pi/2, 0, -pi].toString(), 2)
rotationToValueMap.set([-pi/2, 0, -pi].toString(), 5)
// ----- y = pi ----- //
rotationToValueMap.set([0, pi, -pi].toString(), 6)
rotationToValueMap.set([pi, pi, -pi].toString(), 1)
rotationToValueMap.set([-pi, pi, -pi].toString(), 1)
rotationToValueMap.set([pi/2, pi, -pi].toString(), 5)
rotationToValueMap.set([-pi/2, pi, -pi].toString(), 2)
// ----- y = -pi ----- //
rotationToValueMap.set([0, -pi, -pi].toString(), 6)
rotationToValueMap.set([pi, -pi, -pi].toString(), 1)
rotationToValueMap.set([-pi, -pi, -pi].toString(), 1)
rotationToValueMap.set([pi/2, -pi, -pi].toString(), 5)
rotationToValueMap.set([-pi/2, -pi, -pi].toString(), 2)
// ----- y = pi/2 ----- //
rotationToValueMap.set([0, pi/2, -pi].toString(), 3)
rotationToValueMap.set([pi, pi/2, -pi].toString(), 3)
rotationToValueMap.set([-pi, pi/2, -pi].toString(), 3)
rotationToValueMap.set([pi/2, pi/2, -pi].toString(), 3)
rotationToValueMap.set([-pi/2, pi/2, -pi].toString(), 3)
// ----- y = -pi/2 ----- //
rotationToValueMap.set([0, -pi/2, -pi].toString(), 4)
rotationToValueMap.set([pi, -pi/2, -pi].toString(), 4)
rotationToValueMap.set([-pi, -pi/2, -pi].toString(), 4)
rotationToValueMap.set([pi/2, -pi/2, -pi].toString(), 4)
rotationToValueMap.set([-pi/2, -pi/2, -pi].toString(), 4)

// ------------ z = pi/2 ------------ //
// ----- y = 0 ----- //
rotationToValueMap.set([0, 0, pi/2].toString(), 1)
rotationToValueMap.set([pi, 0, pi/2].toString(), 6)
rotationToValueMap.set([-pi, 0, pi/2].toString(), 6)
rotationToValueMap.set([pi/2, 0, pi/2].toString(), 2)
rotationToValueMap.set([-pi/2, 0, pi/2].toString(), 5)
// ----- y = pi ----- //
rotationToValueMap.set([0, pi, pi/2].toString(), 6)
rotationToValueMap.set([pi, pi, pi/2].toString(), 1)
rotationToValueMap.set([-pi, pi, pi/2].toString(), 1)
rotationToValueMap.set([pi/2, pi, pi/2].toString(), 5)
rotationToValueMap.set([-pi/2, pi, pi/2].toString(), 2)
// ----- y = -pi ----- //
rotationToValueMap.set([0, -pi, pi/2].toString(), 6)
rotationToValueMap.set([pi, -pi, pi/2].toString(), 1)
rotationToValueMap.set([-pi, -pi, pi/2].toString(), 1)
rotationToValueMap.set([pi/2, -pi, pi/2].toString(), 5)
rotationToValueMap.set([-pi/2, -pi, pi/2].toString(), 2)
// ----- y = pi/2 ----- //
rotationToValueMap.set([0, pi/2, pi/2].toString(), 2)
rotationToValueMap.set([pi, pi/2, pi/2].toString(), 5)
rotationToValueMap.set([-pi, pi/2, pi/2].toString(), 5)
rotationToValueMap.set([pi/2, pi/2, pi/2].toString(), 6)
rotationToValueMap.set([-pi/2, pi/2, pi/2].toString(), 1)
// ----- y = -pi/2 ----- //
rotationToValueMap.set([0, -pi/2, pi/2].toString(), 5)
rotationToValueMap.set([pi, -pi/2, pi/2].toString(), 2)
rotationToValueMap.set([-pi, -pi/2, pi/2].toString(), 2)
rotationToValueMap.set([pi/2, -pi/2, pi/2].toString(), 1)
rotationToValueMap.set([-pi/2, -pi/2, pi/2].toString(), 6)

// ------------ z = -pi/2 ------------ //
// ----- y = 0 ----- //
rotationToValueMap.set([0, 0, -pi/2].toString(), 1)
rotationToValueMap.set([pi, 0, -pi/2].toString(), 6)
rotationToValueMap.set([-pi, 0, -pi/2].toString(), 6)
rotationToValueMap.set([pi/2, 0, -pi/2].toString(), 2)
rotationToValueMap.set([-pi/2, 0, -pi/2].toString(), 5)
// ----- y = pi ----- //
rotationToValueMap.set([0, pi, -pi/2].toString(), 6)
rotationToValueMap.set([pi, pi, -pi/2].toString(), 1)
rotationToValueMap.set([-pi, pi, -pi/2].toString(), 1)
rotationToValueMap.set([pi/2, pi, -pi/2].toString(), 5)
rotationToValueMap.set([-pi/2, pi, -pi/2].toString(), 2)
// ----- y = -pi ----- //
rotationToValueMap.set([0, -pi, -pi/2].toString(), 6)
rotationToValueMap.set([pi, -pi, -pi/2].toString(), 1)
rotationToValueMap.set([-pi, -pi, -pi/2].toString(), 1)
rotationToValueMap.set([pi/2, -pi, -pi/2].toString(), 5)
rotationToValueMap.set([-pi/2, -pi, -pi/2].toString(), 2)
// ----- y = pi/2 ----- //
rotationToValueMap.set([0, pi/2, -pi/2].toString(), 5)
rotationToValueMap.set([pi, pi/2, -pi/2].toString(), 2)
rotationToValueMap.set([-pi, pi/2, -pi/2].toString(), 2)
rotationToValueMap.set([pi/2, pi/2, -pi/2].toString(), 1)
rotationToValueMap.set([-pi/2, pi/2, -pi/2].toString(), 6)
// ----- y = -pi/2 ----- //
rotationToValueMap.set([0, -pi/2, -pi/2].toString(), 2)
rotationToValueMap.set([pi, -pi/2, -pi/2].toString(), 5)
rotationToValueMap.set([-pi, -pi/2, -pi/2].toString(), 5)
rotationToValueMap.set([pi/2, -pi/2, -pi/2].toString(), 6)
rotationToValueMap.set([-pi/2, -pi/2, -pi/2].toString(), 1)

export {rotationToValueMap, mapPrecision, pi}