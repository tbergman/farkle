import * as CANNON from 'cannon';
import { useRef, useContext, useState, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import { CannonContext } from '../three/CannonContext'

// Custom hook to maintain a world physics body
export function useCannon({...props}, callback: Function, deps = []) {
  const ref = useRef<THREE.Scene>();
  const cannonContext = useContext(CannonContext); // Get cannon world object
  const [body] = useState(() => new CANNON.Body(props)); // Instanciate a physics body
  useEffect(() => {
    callback(body); // Call function so the user can add shapes
    cannonContext.addBody(body); // Add body to world on mount
    return () => cannonContext.remove(body) // Remove body on unmount
  }, deps);
  useFrame(() => {
    // Transport cannon physics into the referenced threejs object
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.position.copy(body.position);
      // @ts-ignore
      ref.current.quaternion.copy(body.quaternion);
    }
  });
  return {ref, body};
}
