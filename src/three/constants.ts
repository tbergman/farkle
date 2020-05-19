// units in m & kg

export const FPS = 60 // frames per second
export const GRAVITY = -9.8 // m/s^2
const _DIE_SCALE = 0.85/2 // scales the model to 1
export const DIE_SIZE = 16 * _DIE_SCALE / 100 // m
export const DIE_MASS = 40 / 1000 // kg
export const CAMERA_POSITION:[number, number, number] = [0, -1, 3] // m
export const SPOTLIGHT_HEIGHT = 5; // m
export const SPOTLIGHT_RADIUS = 5 // m
export const SPOTLIGHT_POSITION:[number, number, number] = [3, 3, SPOTLIGHT_HEIGHT] // m
export const GROUND_SIZE = 170 // m
export const THROW_POSITION = {
  x: 0.0, // m
  y: -0.0, // m
  z: 1.5 // m
};
export const THROW_SPEED = 0 // m/s