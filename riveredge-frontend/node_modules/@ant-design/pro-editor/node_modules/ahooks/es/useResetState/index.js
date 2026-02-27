import { __read } from "tslib";
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
var useResetState = function (initialState) {
  var _a = __read(useState(initialState), 2),
    state = _a[0],
    setState = _a[1];
  var resetState = useMemoizedFn(function () {
    setState(initialState);
  });
  return [state, setState, resetState];
};
export default useResetState;