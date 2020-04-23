/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"

export const useExternalState = (
  dynamicValue: any,
  deps: Array<any> = []
) => {
  const [state, setState] = useState(dynamicValue)

  useEffect(() => {
    setState(dynamicValue)
  }, [dynamicValue, ...deps])

  return state
}