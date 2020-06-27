import * as CANNON from 'cannon';
import { EULER_ORDER } from "../constants"

export const quat2Euler = (quaternion:CANNON.Quaternion): CANNON.Vec3 => {
  const euler = new CANNON.Vec3(0, 0, 0)
  quaternion.toEuler(euler, EULER_ORDER)
  return euler
}