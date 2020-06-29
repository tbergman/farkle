import * as CANNON from 'cannon';
import * as THREE from 'three';

export type Vec3Array = [number, number, number]

export class V3 {
  static toThree = (v3: CANNON.Vec3 | THREE.Vector3 | Vec3Array): THREE.Vector3 => {
    if(Array.isArray(v3)) {
      return new THREE.Vector3(v3[0], v3[1], v3[2])
    } else {
      return new THREE.Vector3(v3.x, v3.y, v3.z);
    }
  };
  static toCannon = (v3: THREE.Vector3 | CANNON.Vec3 | Vec3Array): CANNON.Vec3 => {
    if (Array.isArray(v3)) {
      return new CANNON.Vec3(v3[0], v3[1], v3[2])
    } else {
      return new CANNON.Vec3(v3.x, v3.y, v3.z);
    }
  };
  static toArray(Vec: THREE.Vector3 | CANNON.Vec3):Vec3Array {
    return [Vec.x, Vec.y, Vec.z]
  }

  static ArrTo3 = (arr: Vec3Array): THREE.Vector3 => {
    console.warn('ArrToThree is deprecated. Use .toThree instead')
    return new THREE.Vector3(arr[0], arr[1], arr[2])
  }
  static ArrToCannon = (arr: Vec3Array): CANNON.Vec3 => {
    console.warn('ArrToCannon is deprecated. Use .toCannon instead')
    return new CANNON.Vec3(arr[0], arr[1], arr[2])
  }
}