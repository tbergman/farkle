import * as CANNON from 'cannon';

const _scale = 0.85/2 // makes the die 1 unit cube
const pi = Math.PI;
const _spread = 7;
const _offset = {
  x: 7,
  y: -7,
};

export const initialConditions = (id:number) => {

  const _offset = {
    x: 12,
    y: -12,
  };
  const position = new CANNON.Vec3(
    ((id % 3) - 1) * _scale * _spread + _offset.x,
    (id >= 3 ? _scale * _spread : _scale) - _spread/2 * _scale + _offset.y,
    1*_scale
  );
  const velocity = new CANNON.Vec3(0,0,0)

  let angularVelocity = new CANNON.Vec3(0, 0, 0);

  let quaternion = new CANNON.Quaternion().setFromEuler(0, 0, 0);

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
    ((id % 3) - 1) * _scale * _spread + _offset.x,
    (id >= 3 ? _scale * _spread : _scale) - (_spread / 2) * _scale + _offset.y,
    _spread * _scale,
  );

  const velocity = new CANNON.Vec3(
    (Math.random() - 0.5) * 2 - _offset.x*1,
    Math.random() * (id >= 3 ? 2 : -2) - _offset.y*1,
    -1
  )

  const angularVelocity = new CANNON.Vec3(
    4 * Math.PI * Math.random(),
    4 * Math.PI * Math.random(),
    4 * Math.PI * Math.random()
  );

  let quaternion = new CANNON.Quaternion().setFromEuler(
    4 * Math.PI * Math.random(),
    4 * Math.PI * Math.random(),
    4 * Math.PI * Math.random()
  );


  return {position, quaternion, velocity, angularVelocity};

};