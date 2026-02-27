"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClickAway = void 0;
var react_1 = require("react");
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
var useClickAway = function (onClickAway, target, eventName) {
    if (eventName === void 0) { eventName = defaultEvent; }
    var onClickAwayRef = (0, react_1.useRef)(onClickAway);
    onClickAwayRef.current = onClickAway;
    (0, react_1.useEffect)(function () {
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
exports.useClickAway = useClickAway;
//# sourceMappingURL=useClickAway.js.map