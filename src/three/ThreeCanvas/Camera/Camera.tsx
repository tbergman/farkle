import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { PerspectiveCamera } from 'three';

type CameraProps = {
  position: [number,number,number]
}

const Camera = ({position} : CameraProps) => {
  const ref = useRef<PerspectiveCamera>();
  const {setDefaultCamera} = useThree();
  // Make the camera known to the system
  useEffect(() => {
    if (ref.current) setDefaultCamera(ref.current)
  }, [ref, setDefaultCamera]);
  // Update it every frame
  useFrame(() => ref.current?.updateMatrixWorld());

  return <perspectiveCamera ref={ref} position={position} />;
} 

export default Camera;
