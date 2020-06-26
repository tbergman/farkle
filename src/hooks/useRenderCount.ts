import { useRef } from "react"

export const useRenderCount = (name: string) => {
  const renders = useRef(0)
  console.log(`Rendered ${name} ${renders.current++} times`)
}