import { useRef, useEffect } from 'react';
var defaultEvent = 'click';
function getTargetElement(target, defaultElement) {
    if (!target) {
        return defaultElement;
    }
    var targetElement;
    if (typeof target === 'function') {
        targetElement = target();
    }
    else if ('current' in target) {
        targetElement = target.current;
    }
    else {
        targetElement = target;
    }
    return targetElement;
}
export var useClickAway = function (onClickAway, target, eventName) {
    if (eventName === void 0) { eventName = defaultEvent; }
    var onClickAwayRef = useRef(onClickAway);
    onClickAwayRef.current = onClickAway;
    useEffect(function () {
        var handler = function (event) {
            var targets = Array.isArray(target) ? target : [target];
            if (targets.some(function (targetItem) {
                var targetElement = getTargetElement(targetItem);
                return !targetElement || (targetElement === null || targetElement === void 0 ? void 0 : targetElement.contains(event.target));
            })) {
                return;
            }
            onClickAwayRef.current(event);
        };
        document.addEventListener(eventName, handler);
        return function () {
            document.removeEventListener(eventName, handler);
        };
    }, [target, eventName]);
};
//# sourceMappingURL=useClickAway.js.map