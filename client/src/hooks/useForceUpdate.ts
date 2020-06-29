import { useState } from "react";

export const useForceUpdate = () => {
  const [, setValue] = useState(false); // integer state
  return () => setValue((value) => !value); // update the state to force render
}
