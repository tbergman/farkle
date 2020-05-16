// units in m & kg

export const FPS = 60 // frames per second
export const GRAVITY = -9.8 // m/s^2
export const _DIE_SCALE = 0.85/2 // scales the model to 1
export const DIE_SIZE = 16 * _DIE_SCALE / 1000 // m
export const DIE_MASS = 4 / 1000 // kg
export const CAMERA_POSITION:[number, number, number] = [0, -0.15, 0.20] // m
export const SPOTLIGHT_POSITION:[number, number, number] = [0.3, 0.3, 0.5]
export const GROUND_SIZE = 170 // mm
export const THROW_POSITION = {
  x: 0.0, // m
  y: -0.0, // m
  z: 0.15// m
};
export const THROW_SPEED = 0 // m/s