import { useRef } from 'react';
import useEffectWithTarget from './useEffectWithTarget';
import { depsEqual } from './depsEqual';
var useDeepCompareEffectWithTarget = function (effect, deps, target) {
  var ref = useRef();
  var signalRef = useRef(0);
  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }
  useEffectWithTarget(effect, [signalRef.current], target);
};
export default useDeepCompareEffectWithTarget;