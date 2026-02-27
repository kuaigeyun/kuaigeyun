import { __read } from "tslib";
import { useState, useRef, useCallback } from 'react';
function useGetState(initialState) {
  var _a = __read(useState(initialState), 2),
    state = _a[0],
    setState = _a[1];
  var stateRef = useRef(state);
  stateRef.current = state;
  var getState = useCallback(function () {
    return stateRef.current;
  }, []);
  return [state, setState, getState];
}
export default useGetState;