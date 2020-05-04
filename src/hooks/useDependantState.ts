/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"

export const useDependantState = (
  dynamicValue: any,
  deps: Array<any> = []
) => {
  const [state, setState] = useState(dynamicValue)

  useEffect(() => {
    setState(dynamicValue)
  }, [...deps])

  return state
}