import { useEffect } from "react"

export const useVH = ():void => {
  useEffect(() => {
    window.addEventListener('resize', () => {
      document.body.style.setProperty('--vh', `${window.innerHeight / 100}px`)
    })
  }, [])
}