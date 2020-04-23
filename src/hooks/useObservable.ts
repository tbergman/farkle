/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Observable } from "rxjs";

export const useObservable = (
  observable: Observable<any> | undefined,
  dependencies: Array<any> = []
): any => {
  const [state, setState] = useState();

  useEffect(() => {
    if(observable) {
      const sub = observable.subscribe(setState);
      return () => sub.unsubscribe();
    }
    return
  }, [observable, ...dependencies]);

  return state;
};
