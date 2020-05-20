import React from 'react';
import Die3DComponent from '../../../three/Die3DComponent';
import {Vec3Array} from '../../../util/vectorConvert';
import { rotationToValueMap } from '../../../three/Die3DComponent/rotationToValueMap';
import { useCameraToGroundCoords } from '../../../hooks/useCameraToGroundCoords';

type DieInGridProps = {
  index: number,
  rotation: Vec3Array,
  value:number,
}
const DieInGrid = ({ index, rotation, value }: DieInGridProps) => {
  const w = 0.9
  const h = 0.9
  const coords = useCameraToGroundCoords(
    -w + w/25 + 2*w/25 * (Math.floor(index/5)%25), 
    h - h/5 - 2*h/5 * (index%5)
  )

  return (
    <Die3DComponent
      id={index}
      isFrozen={false}
      turnState={'observing'}
      setValue={() => { }}
      onFreeze={() => { console.log(`value: ${value},\nrotation: ${rotation},\nindex: ${index}`)}}
      position={coords}
      rotation={rotation}
    />
  )
}

const DiceGrid = () => {

  return (
    <>{
      Array.from(rotationToValueMap).map((map:[string, number], i) => {
        const [rotation, value] = map
        return (
          <DieInGrid 
            key={i}
            index={i}
            rotation={rotation.split(',').map((r:string) => Number(r)) as Vec3Array}
            value={value}
          />
        )
      })
    }</>
  )
}

export default DiceGrid;
