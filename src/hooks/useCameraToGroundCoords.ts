import * as THREE from 'three';
import { useThree } from 'react-three-fiber';
import { useEffect, useState } from 'react';
import { round } from '../util/round';
import { DIE_SIZE } from '../three/constants';

export const useCameraToGroundCoords = (cameraX: number, cameraY: number):THREE.Vector3 => {
  const {camera, raycaster, scene} = useThree();
  const [groundCoords, setGroundCoords] = useState<THREE.Vector3>(new THREE.Vector3(0,0,0))


  useEffect(() => {
    raycaster.setFromCamera(new THREE.Vector2(cameraX, cameraY), camera);
    const intersects = raycaster.intersectObjects(scene.children);
    const groundIxn = intersects.find((ix) => round(ix.point.z, 2) === 0);
    if (groundIxn) {
      const p = groundIxn.point
      p.setZ(DIE_SIZE)
      setGroundCoords(p)
    }
  }, [camera, cameraX, cameraY, raycaster, scene.children]);

  return groundCoords;
}