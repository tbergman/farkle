import * as CANNON from 'cannon';
import * as THREE from 'three';

export type Vec3Array = [number, number, number]

export class ConvertVector {
  static CannonTo3 = (C: CANNON.Vec3): THREE.Vector3 => {
    return new THREE.Vector3(C.x, C.y, C.z);
  };
  static ThreeToCannon = (_3: THREE.Vector3): CANNON.Vec3 => {
    return new CANNON.Vec3(_3.x, _3.y, _3.z);
  };
  static toArray(Vec: THREE.Vector3 | CANNON.Vec3):Vec3Array {
    return [Vec.x, Vec.y, Vec.z]
  }
  static ArrTo3 = (arr: Vec3Array): THREE.Vector3 => {
    return new THREE.Vector3(arr[0], arr[1], arr[2])
  }
  static ArrToCannon = (arr: Vec3Array): CANNON.Vec3 => {
    return new CANNON.Vec3(arr[0], arr[1], arr[2])
  }
}