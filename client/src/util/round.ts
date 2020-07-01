export const round = (num: number, to: number) =>
  Math.round(num * Math.pow(10, to)) / Math.pow(10, to);
