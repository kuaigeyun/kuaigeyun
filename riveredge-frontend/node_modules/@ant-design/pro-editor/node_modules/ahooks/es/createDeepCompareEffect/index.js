import { useRef } from 'react';
import { depsEqual } from '../utils/depsEqual';
export var createDeepCompareEffect = function (hook) {
  return function (effect, deps) {
    var ref = useRef();
    var signalRef = useRef(0);
    if (deps === undefined || !depsEqual(deps, ref.current)) {
      ref.current = deps;
      signalRef.current += 1;
    }
    hook(effect, [signalRef.current]);
  };
};