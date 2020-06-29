import * as CANNON from 'cannon';
import { DIE_SIZE, THROW_SPEED, THROW_POSITION, EULER_ORDER } from '../../constants';
// units in mm & grams

const _scale = DIE_SIZE


export const formation = (id:number) => {
  const _spread = 6; // mm
  return {
    x: ((id % 3) - 1) * _scale * _spread,
    y: (id >= 3 ? _scale * _spread : _scale) - _spread / 2 * _scale,
    z: _scale
  }
}

export const initialConditions = (id:number) => {

  const position = new CANNON.Vec3(
    formation(id).x + THROW_POSITION.x,
    formation(id).y + THROW_POSITION.y,
    formation(id).z
  );
  const velocity = new CANNON.Vec3(0,0,0)

  let angularVelocity = new CANNON.Vec3(0, 0, 0);

  let quaternion = new CANNON.Quaternion().setFromEuler(0, 0, 0, EULER_ORDER);

  // // For testing
  // if (id === 0) {
  //   quaternion = new CANNON.Quaternion().setFromEuler((Math.random()-0.5) * pi, (Math.random()-0.5) * pi, (Math.random()-0.5) * pi);
  // } else if (id === 1) {
  //   quaternion = new CANNON.Quaternion().setFromEuler((Math.random()-0.5) * pi, (Math.random()-0.5) * pi, (Math.random()-0.5) * pi);
  // } else if (id === 2) {
  //   quaternion = new CANNON.Quaternion().setFromEuler((Math.random()-0.5) * pi, (Math.random()-0.5) * pi, (Math.random()-0.5) * pi);
  // } else if (id === 3) {
  //   quaternion = new CANNON.Quaternion().setFromEuler((Math.random()-0.5) * pi, (Math.random()-0.5) * pi, (Math.random()-0.5) * pi);
  // } else if (id === 4) {
  //   quaternion = new CANNON.Quaternion().setFromEuler((Math.random()-0.5) * pi, (Math.random()-0.5) * pi, (Math.random()-0.5) * pi);
  // } else if (id === 5) {
  //   quaternion = new CANNON.Quaternion().setFromEuler((Math.random()-0.5) * pi, (Math.random()-0.5) * pi, (Math.random()-0.5) * pi);
  // } 

  return {position, quaternion, velocity, angularVelocity};
}

export const throwConditions = (id: number) => {

  const position = new CANNON.Vec3(
    formation(id).x + THROW_POSITION.x,
    formation(id).y + THROW_POSITION.y,
    THROW_POSITION.z
  );

  const velocity = new CANNON.Vec3(
    -THROW_SPEED,
    THROW_SPEED,
    -0
  )

  const angularVelocity = new CANNON.Vec3(
    6 * Math.PI * Math.random(),
    6 * Math.PI * Math.random(),
    6 * Math.PI * Math.random()
  );

  let quaternion = new CANNON.Quaternion().setFromEuler(
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random(),
    EULER_ORDER
  );

  return {position, quaternion, velocity, angularVelocity};

};