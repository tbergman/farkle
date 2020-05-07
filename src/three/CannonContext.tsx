// Cannon-world context provider
import * as CANNON from 'cannon';
import React, {useEffect, useState } from 'react';
import { useFrame} from 'react-three-fiber';

type CannonContextProps = {
  children: React.ReactNode
}

interface CannonContextInterface {
  world: CANNON.World | null,
}

export const CannonContext = React.createContext<CANNON.World>(new CANNON.World());
export const CannonContextProvider = ({children}: CannonContextProps) => {
  // Set up physics
  const [world] = useState(() => new CANNON.World());
  useEffect(() => {
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    world.gravity.set(0, 0, -10);
  }, [world]);
  // Run world stepper every frame
  useFrame(() => world.step(1 / 60));
  // Distribute world via context
  return <CannonContext.Provider value={world} children={children} />;
}