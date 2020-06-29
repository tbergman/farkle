export const newRoomCode = (length = 4) => 
Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, length)
  .toUpperCase();