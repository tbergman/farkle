import * as CANNON from 'cannon';

export const groundMaterial = new CANNON.Material('groundMaterial');
export const dieMaterial = new CANNON.Material('dieMaterial');
export const frozenMaterial = new CANNON.Material('frozenMaterial');

export const dieGroundContactMaterial = new CANNON.ContactMaterial(
  groundMaterial,
  dieMaterial,
  {
    friction: 0.4,
    restitution: 0.25,
  }
);

export const dieDieContactMaterial = new CANNON.ContactMaterial(
  dieMaterial,
  dieMaterial,
  {
    friction: 0.4,
    restitution: 0.4,
  }
)

export const frozenDieContactMaterial = new CANNON.ContactMaterial(
  frozenMaterial,
  dieMaterial,
  {
    friction: 0,
    restitution: 0
  }
);

export const frozenGroundContactMaterial = new CANNON.ContactMaterial(
  frozenMaterial,
  groundMaterial,
  {
    friction: 1,
    restitution: 0
  }
);