import React from 'react'
import Stats from 'three/examples/jsm/libs/stats.module';
import { useFrame, useThree } from 'react-three-fiber';

const stats = Stats()
stats.showPanel(0);
document.body.appendChild(stats.dom);

const StatsComponent = () => {

  const {gl, scene} = useThree()

  useFrame(() => {
    stats.begin()
    stats.end()
  })
  return <></>
};

export default StatsComponent;
