import * as CANNON from 'cannon';

const round = (num: number, to: number) => Math.round(num * Math.pow(10, to)) / Math.pow(10, to);

/**
 * 
 * Returns whether the body has stopped moving.
 * Determined when velocity and angular velocity are 0,
 * Body's Euler angles include a right angle,
 * and the body has been initialized (non-NaN inertia value)
 * 
 */
export const hasSettled = (body: CANNON.Body, scene: THREE.Scene) => {
  return (
    isAtRightAngle(body) && 
    Math.abs(body.velocity.x).toFixed(2) === '0.00' &&
    Math.abs(body.velocity.y).toFixed(2) === '0.00' &&
    Math.abs(body.velocity.z).toFixed(2) === '0.00' &&
    Math.abs(body.angularVelocity.x).toFixed(2) === '0.00' &&
    Math.abs(body.angularVelocity.y).toFixed(2) === '0.00' &&
    Math.abs(body.angularVelocity.z).toFixed(2) === '0.00' &&
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
  const rightAngles = [0, round(Math.PI / 2, 2), round(Math.PI, 2)]
  const eulerVec = new CANNON.Vec3(0,0,0)
  body.quaternion.toEuler(eulerVec)
  const x = Math.abs(round(eulerVec.x, 2))
  const y = Math.abs(round(eulerVec.y, 2))
  const z = Math.abs(round(eulerVec.z, 2))
  
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