import { DIE_SIZE, THROW_SPEED, THROW_POSITION, EULER_ORDER } from '../constants';

export type ThrowCondition = {
  position: [number, number, number],
  velocity: [number, number, number],
  rotation: [number, number, number, string],
  angularVelocity: [number, number, number],
}

export type ThrowConditionsArray = Array<ThrowCondition>

export const formation = (id: number) => {
  const _spread = 6; // mm
  return {
    x: ((id % 3) - 1) * DIE_SIZE * _spread,
    y: (id >= 3 ? DIE_SIZE * _spread : DIE_SIZE) - _spread / 2 * DIE_SIZE,
    z: DIE_SIZE
  }
}

export const generateThrowCondition = (id: number): ThrowCondition => {
  
  const position: [number, number, number] = [
    formation(id).x + THROW_POSITION.x,
    formation(id).y + THROW_POSITION.y,
    THROW_POSITION.z
  ];

  const velocity: [number, number, number] =  [
    -THROW_SPEED,
    THROW_SPEED,
    -0
  ]

  const angularVelocity: [number, number, number] = [
    6 * Math.PI * Math.random(),
    6 * Math.PI * Math.random(),
    6 * Math.PI * Math.random()
  ]

  let rotation: [number, number, number, string] = [
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random(),
    EULER_ORDER
  ]
  
  if (id < 0) {
    return {
      position,
      velocity: [0, 0, 0],
      rotation: [0, 0, 0, EULER_ORDER],
      angularVelocity: [0, 0, 0]
    }
  }

  return { position, rotation, velocity, angularVelocity };

};
