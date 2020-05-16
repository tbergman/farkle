// units in mm & grams

export const FPS = 60 // frames per second
export const GRAVITY = -9800 // mm/s^2
export const _DIE_SCALE = 0.85/2 // scales the model to 1
export const DIE_SIZE = 16 * _DIE_SCALE // mm
export const DIE_MASS = 4.1 // g
export const CAMERA_POSITION:[number, number, number] = [0, -150, 200] // m
export const SPOTLIGHT_POSITION:[number, number, number] = [300, 300, 500]
export const GROUND_SIZE = 1700 // mm
export const THROW_POSITION = {
  x: 100, // mm
  y: -100, // mm
  z: 50
};
export const THROW_SPEED = 700 // mm/s