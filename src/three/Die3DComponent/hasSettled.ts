import * as CANNON from 'cannon';
import { round } from '../../util/round';
import { DIE_SIZE, EULER_ORDER } from '../constants';
import { quat2Euler } from '../../util/quat2Euler';

/**
 * 
 * Returns whether the body has stopped moving.
 * Determined when velocity and angular velocity are 0,
 * Body's Euler angles include a right angle,
 * and the body has been initialized (non-NaN inertia value)
 * 
 */
export const hasSettled = (body: CANNON.Body):boolean => {
  const _precision = 1;
  return (
    isAtRightAngle(body) && 
    Math.abs(round(body.velocity.x, _precision)) === 0 &&
    Math.abs(round(body.velocity.y, _precision)) === 0 &&
    Math.abs(round(body.velocity.z, _precision)) === 0 &&
    Math.abs(round(body.angularVelocity.x, _precision)) === 0 &&
    Math.abs(round(body.angularVelocity.y, _precision)) === 0 &&
    Math.abs(round(body.angularVelocity.z, _precision)) === 0 &&
    !isNaN(body.inertia.x) &&
    !isNaN(body.inertia.y) &&
    !isNaN(body.inertia.z)
  )
}

/**
 * 
 * Determines wheter one of the Euler angles of the body is right pi or pi/2
 */
export const isAtRightAngle = (body: CANNON.Body):boolean => {
  const _precision = 4
  const rightAngles = [0, round(Math.PI / 2, _precision), round(Math.PI, _precision)]
  const eulerVec = quat2Euler(body.quaternion)
  const x = Math.abs(round(eulerVec.x, _precision))
  const y = Math.abs(round(eulerVec.y, _precision))
  const z = Math.abs(round(eulerVec.z, _precision))
  return rightAngles.includes(x) || rightAngles.includes(y) || rightAngles.includes(z)
}

export const forceSettle = (body: CANNON.Body):CANNON.Body => {

  body.velocity = new CANNON.Vec3(0, 0, 0)
  body.angularVelocity = new CANNON.Vec3(0, 0, 0)
  let currentEuler = quat2Euler(body.quaternion)

  // round angle to the nearest pi
  const newEuler:[number, number, number, string] = [
    ([-2, -1, 0, 1, 2].find(x => x === round(currentEuler.x / (Math.PI / 2), 1)) || currentEuler.x/(Math.PI/2)) * Math.PI/2,
    ([-2, -1, 0, 1, 2].find(y => y === round(currentEuler.y / (Math.PI / 2), 1)) || currentEuler.y/(Math.PI/2)) * Math.PI/2,
    ([-2, -1, 0, 1, 2].find(z => z === round(currentEuler.z / (Math.PI / 2), 1)) || currentEuler.z/(Math.PI/2)) * Math.PI/2,
    EULER_ORDER
  ]
  body.quaternion.setFromEuler(...newEuler)
  // body.position.z = DIE_SIZE * 2

  return body
}

/**
 * 
 * Logs the quaternion as a vector + angle (in deg)
 */
export const logQuat = (body: CANNON.Body) => {
  const round = (num: number, to: number) =>
    Math.round(num * Math.pow(10, to)) / Math.pow(10, to);
  const q = body.quaternion;
  const qAngle = q.toAxisAngle();
  console.log(
    `(${round(qAngle[0].x, 2)}, ${round(qAngle[0].y, 2)}, ${round(
      qAngle[0].z,
      2
    )})`,
    `${round((qAngle[1] * 180) / Math.PI, 2)}˚`
  );

  console.log(isAtRightAngle(body));
};