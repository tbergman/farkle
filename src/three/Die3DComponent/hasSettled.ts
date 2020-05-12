import * as CANNON from 'cannon';
import { round } from '../../util/round';

/**
 * 
 * Returns whether the body has stopped moving.
 * Determined when velocity and angular velocity are 0,
 * Body's Euler angles include a right angle,
 * and the body has been initialized (non-NaN inertia value)
 * 
 */
export const hasSettled = (body: CANNON.Body) => {
  const _precision = 2;
  return (
    isAtRightAngle(body) && 
    Math.abs(round(body.velocity.x, _precision)) === 0.00 &&
    Math.abs(round(body.velocity.y, _precision)) === 0.00 &&
    Math.abs(round(body.velocity.z, _precision)) === 0.00 &&
    Math.abs(round(body.angularVelocity.x, _precision)) === 0.00 &&
    Math.abs(round(body.angularVelocity.y, _precision)) === 0.00 &&
    Math.abs(round(body.angularVelocity.z, _precision)) === 0.00 &&
    !isNaN(body.inertia.x) &&
    !isNaN(body.inertia.y) &&
    !isNaN(body.inertia.z)
  )
}

/**
 * 
 * Determines wheter one of the Euler angles of the body is right pi or pi/2
 */
export const isAtRightAngle = (body: CANNON.Body) => {
  const _precision = 4
  const rightAngles = [0, round(Math.PI / 2, _precision), round(Math.PI, _precision)]
  const eulerVec = new CANNON.Vec3(0,0,0)
  body.quaternion.toEuler(eulerVec)
  const x = Math.abs(round(eulerVec.x, _precision))
  const y = Math.abs(round(eulerVec.y, _precision))
  const z = Math.abs(round(eulerVec.z, _precision))
  return rightAngles.includes(x) || rightAngles.includes(y) || rightAngles.includes(z)
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