import React from 'react';
import PropTypes from 'prop-types';
import { useThree, ReactThreeFiber, extend } from 'react-three-fiber';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

extend({OrbitControls});

const OrbitControlsComponent = () => {
  const {
    camera,
    gl: {domElement}
  } = useThree()
  return <orbitControls args={[camera, domElement]} />;
};


export default OrbitControlsComponent;
