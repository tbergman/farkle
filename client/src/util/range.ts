
export const range = (start: number, end?: number):Array<null> => {
  if (!end) {
    end = start
    start = 0
  }
  return new Array(end-start).fill(null)
}

export const mapCount = (n: number, callback: ( i:number) => React.ReactNode) => {
  return range(0, n).map((_, i) => callback(i))
}