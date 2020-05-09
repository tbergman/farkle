import { DieValue } from "../../game/Die";

const faces = [
  [0, 2, 0],
  [4, 1, 3],
  [0, 5, 0],
  [0, 6, 0],
];
const startPosition = [1,1]

type Direction = 'up' | 'down' | 'left' | 'right' | '+Z' | '-Z';

const movePosition = (position: Array<number>, direction: Direction):Array<number> => {

  switch (direction) {
    case 'up':
      position[0] = position[0] > 0 ? position[0] - 1 : faces.length - 1; // move up
      while (faces[position[0]][position[1]] === 0) { // if the face is empty
        position[1] = position[1] > 0 ? position[1] - 1 : faces[0].length - 1; // move left until we get a face
      }
      return position;
    case 'down':
      position[0] = position[0] < faces.length - 1 ? position[0] + 1 : 0; // move down
      while (faces[position[0]][position[1]] === 0) { // if the face is empty
        position[1] = position[1] > 0 ? position[1] - 1 : faces[0].length - 1; // move left until we get a face
      }
      return position;
    case 'left':
      if (position[1] === 0) { // 4
        position = [3, 1] // 6
      } else if (position[0] === faces.length - 1) { // 6
        position = [1,2] // 3
      } else {
        position = [1, 0]; // 4
      }
      return position;
    case 'right':
      if (position[1] === faces[0].length - 1) { // 3
        position = [3, 1]; // 6
      } else if (position[0] === faces.length - 1) { // 6
        position = [1,0] // 4
      } else {
        position = [1, 2]; // 3
      }
      return position;

    default:
      break;
  }

  return [0,0]
}


export const getDieValue = (_rot: [number, number, number]): DieValue => {  
  let moves: Array<Direction> = [];
  let rot = _rot
    .map((r) => {
      return [0.5, 1].includes(Math.abs(r)) ? r * 2 : 0;
    })
  rot.forEach((r, i) => {
    let dir: Direction;
    if (i === 0) {
      dir = r > 0 ? 'up' : 'down';
    } else if (i === 1) {
      dir = r > 0 ? 'left' : 'right';
    } else {
      dir = r > 0 ? '+Z' : '-Z'
    }
    for (let j = 0; j < Math.abs(r); j++) {
      moves.push(dir);
    }
  });
  let position = [...startPosition]
  moves.reverse() // make transforms go first
  // console.log(...moves)

  for (let k in moves) {
    let move = moves[k]
    if (move === '+Z') {
      moves = moves.map((m) => {
        if (m === 'up') return 'right';
        if (m === 'right') return 'down';
        if (m === 'down') return 'left';
        if (m === 'left') return 'up';
        return m;
      });
    } else if (move === '-Z') {
      moves = moves.map(m => {
        if (m === 'up') return 'left';
        if (m === 'left') return 'down';
        if (m === 'down') return 'right';
        if (m === 'right') return 'up';
        
        return m
      })
    } else {
      position = movePosition(position, move);
    }
  }

  // console.log(moves)
  // console.log(faces[position[0]][position[1]]);

  return faces[position[0]][position[1]] as DieValue
}