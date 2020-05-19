
export const range = (start: number, end?: number) => {
  if (!end) {
    end = start
    start = 0
  }
  return new Array(end-start).fill(null)
}