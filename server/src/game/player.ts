export type playerType = 'human' | 'computer'

export type Player = {
  id: number,
  type: playerType,
  name: string
}

export const newPlayer = (i: number, name?: string): Player => {
  return {
    id: i,
    type: 'human',
    name: name || `Player ${i + 1}`
  }
}