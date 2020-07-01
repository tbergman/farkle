import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

type LineProps = {
  origin: THREE.Vector3,
  dir: THREE.Vector3
}

const Line = ({origin, dir}: LineProps) => {
  
  return (
    <line>
      <geometry
        name="geometry"
        vertices={[origin, dir]}
      />
      <lineBasicMaterial name="material" color="cyan" />
    </line>
  );
}

export default Line;
