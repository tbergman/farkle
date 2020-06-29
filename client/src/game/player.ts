export type playerType = 'human' | 'computer'

export type Player = {
  id: number,
  type: playerType,
  name: string
}

export const newPlayer = (i: number): Player => {
  return {
    id: i,
    type: 'human',
    name: `Player ${i + 1}`
  }
}