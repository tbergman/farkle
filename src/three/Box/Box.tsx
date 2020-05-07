import React, { useRef, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';

const  Box = (props: any) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<THREE.Mesh>();
  const {camera} = useThree()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => {
  //   if (mesh && mesh.current) {
  //     mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  //   }
  // });

  const handleClick = () => {
    const v = mesh.current?.position.clone();
    console.log(v?.project(camera))
    console.log(v?.unproject(camera))
  }

  return (
    <mesh
      {...props}
      ref={mesh}
      // scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => handleClick()}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  );
}

export default Box;
