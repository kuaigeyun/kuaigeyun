/*
Copyright (c) 2019 Daybrush
name: @scena/dragscroll
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/dragscroll.git
version: 1.4.0
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.DragScroll = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
      return extendStatics(d, b);
    };
    function __extends(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 1.10.2
    */
    /**
    * get string "function"
    * @memberof Consts
    * @example
    import {FUNCTION} from "@daybrush/utils";

    console.log(FUNCTION); // "function"
    */
    var FUNCTION = "function";
    /**
    * get string "object"
    * @memberof Consts
    * @example
    import {OBJECT} from "@daybrush/utils";

    console.log(OBJECT); // "object"
    */
    var OBJECT = "object";
    /**
    * get string "string"
    * @memberof Consts
    * @example
    import {STRING} from "@daybrush/utils";

    console.log(STRING); // "string"
    */
    var STRING = "string";
    /**
    * Check the type that the value is object.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isObject} from "@daybrush/utils";

    console.log(isObject({})); // true
    console.log(isObject(undefined)); // false
    console.log(isObject("")); // false
    console.log(isObject(null)); // false
    */
    function isObject(value) {
      return value && typeof value === OBJECT;
    }
    /**
    * Check the type that the value is string.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isString} from "@daybrush/utils";

    console.log(isString("1234")); // true
    console.log(isString(undefined)); // false
    console.log(isString(1)); // false
    console.log(isString(null)); // false
    */
    function isString(value) {
      return typeof value === STRING;
    }
    /**
    * Check the type that the value is function.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isFunction} from "@daybrush/utils";

    console.log(isFunction(function a() {})); // true
    console.log(isFunction(() => {})); // true
    console.log(isFunction("1234")); // false
    console.log(isFunction(1)); // false
    console.log(isFunction(null)); // false
    */
    function isFunction(value) {
      return typeof value === FUNCTION;
    }
    /**
    * Date.now() method
    * @memberof CrossBrowser
    * @return {number} milliseconds
    * @example
    import {now} from "@daybrush/utils";

    console.log(now()); // 12121324241(milliseconds)
    */
    function now() {
      return Date.now ? Date.now() : new Date().getTime();
    }
    /**
    * Returns the index of the first element in the array that satisfies the provided testing function.
    * @function
    * @memberof CrossBrowser
    * @param - The array `findIndex` was called upon.
    * @param - A function to execute on each value in the array until the function returns true, indicating that the satisfying element was found.
    * @param - Returns defaultIndex if not found by the function.
    * @example
    import { findIndex } from "@daybrush/utils";

    findIndex([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // 1
    */
    function findIndex(arr, callback, defaultIndex) {
      if (defaultIndex === void 0) {
        defaultIndex = -1;
      }
      var length = arr.length;
      for (var i = 0; i < length; ++i) {
        if (callback(arr[i], i, arr)) {
          return i;
        }
      }
      return defaultIndex;
    }

    /*
    Copyright (c) 2019 Daybrush
    name: @scena/event-emitter
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/gesture.git
    version: 1.0.5
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var __assign$1 = function () {
      __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$1.apply(this, arguments);
    };
    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    /**
     * Implement EventEmitter on object or component.
     */

    var EventEmitter =
    /*#__PURE__*/
    function () {
      function EventEmitter() {
        this._events = {};
      }
      /**
       * Add a listener to the registered event.
       * @param - Name of the event to be added
       * @param - listener function of the event to be added
       * @example
       * import EventEmitter from "@scena/event-emitter";
       * cosnt emitter = new EventEmitter();
       *
       * // Add listener in "a" event
       * emitter.on("a", () => {
       * });
       * // Add listeners
       * emitter.on({
       *  a: () => {},
       *  b: () => {},
       * });
       */


      var __proto = EventEmitter.prototype;

      __proto.on = function (eventName, listener) {
        if (isObject(eventName)) {
          for (var name in eventName) {
            this.on(name, eventName[name]);
          }
        } else {
          this._addEvent(eventName, listener, {});
        }

        return this;
      };
      /**
       * Remove listeners registered in the event target.
       * @param - Name of the event to be removed
       * @param - listener function of the event to be removed
       * @example
       * import EventEmitter from "@scena/event-emitter";
       * cosnt emitter = new EventEmitter();
       *
       * // Remove all listeners.
       * emitter.off();
       *
       * // Remove all listeners in "A" event.
       * emitter.off("a");
       *
       *
       * // Remove "listener" listener in "a" event.
       * emitter.off("a", listener);
       */


      __proto.off = function (eventName, listener) {
        if (!eventName) {
          this._events = {};
        } else if (isObject(eventName)) {
          for (var name in eventName) {
            this.off(name);
          }
        } else if (!listener) {
          this._events[eventName] = [];
        } else {
          var events = this._events[eventName];

          if (events) {
            var index = findIndex(events, function (e) {
              return e.listener === listener;
            });

            if (index > -1) {
              events.splice(index, 1);
            }
          }
        }

        return this;
      };
      /**
       * Add a disposable listener and Use promise to the registered event.
       * @param - Name of the event to be added
       * @param - disposable listener function of the event to be added
       * @example
       * import EventEmitter from "@scena/event-emitter";
       * cosnt emitter = new EventEmitter();
       *
       * // Add a disposable listener in "a" event
       * emitter.once("a", () => {
       * });
       *
       * // Use Promise
       * emitter.once("a").then(e => {
       * });
       */


      __proto.once = function (eventName, listener) {
        var _this = this;

        if (listener) {
          this._addEvent(eventName, listener, {
            once: true
          });
        }

        return new Promise(function (resolve) {
          _this._addEvent(eventName, resolve, {
            once: true
          });
        });
      };
      /**
       * Fires an event to call listeners.
       * @param - Event name
       * @param - Event parameter
       * @return If false, stop the event.
       * @example
       *
       * import EventEmitter from "@scena/event-emitter";
       *
       *
       * const emitter = new EventEmitter();
       *
       * emitter.on("a", e => {
       * });
       *
       *
       * emitter.emit("a", {
       *   a: 1,
       * });
       */


      __proto.emit = function (eventName, param) {
        var _this = this;

        if (param === void 0) {
          param = {};
        }

        var events = this._events[eventName];

        if (!eventName || !events) {
          return true;
        }

        var isStop = false;
        param.eventType = eventName;

        param.stop = function () {
          isStop = true;
        };

        param.currentTarget = this;

        __spreadArrays(events).forEach(function (info) {
          info.listener(param);

          if (info.once) {
            _this.off(eventName, info.listener);
          }
        });

        return !isStop;
      };
      /**
       * Fires an event to call listeners.
       * @param - Event name
       * @param - Event parameter
       * @return If false, stop the event.
       * @example
       *
       * import EventEmitter from "@scena/event-emitter";
       *
       *
       * const emitter = new EventEmitter();
       *
       * emitter.on("a", e => {
       * });
       *
       *
       * emitter.emit("a", {
       *   a: 1,
       * });
       */

      /**
      * Fires an event to call listeners.
      * @param - Event name
      * @param - Event parameter
      * @return If false, stop the event.
      * @example
      *
      * import EventEmitter from "@scena/event-emitter";
      *
      *
      * const emitter = new EventEmitter();
      *
      * emitter.on("a", e => {
      * });
      *
      * // emit
      * emitter.trigger("a", {
      *   a: 1,
      * });
      */


      __proto.trigger = function (eventName, param) {
        if (param === void 0) {
          param = {};
        }

        return this.emit(eventName, param);
      };

      __proto._addEvent = function (eventName, listener, options) {
        var events = this._events;
        events[eventName] = events[eventName] || [];
        var listeners = events[eventName];
        listeners.push(__assign$1({
          listener: listener
        }, options));
      };

      return EventEmitter;
    }();

    function getDefaultScrollPosition(e) {
      var container = e.container;
      if (container === document.body) {
        return [container.scrollLeft || document.documentElement.scrollLeft, container.scrollTop || document.documentElement.scrollTop];
      }
      return [container.scrollLeft, container.scrollTop];
    }
    function checkDefaultScrollEvent(container, callback) {
      container.addEventListener("scroll", callback);
      return function () {
        container.removeEventListener("scroll", callback);
      };
    }
    function getContainerElement(container) {
      if (!container) {
        return null;
      } else if (isString(container)) {
        return document.querySelector(container);
      }
      if (isFunction(container)) {
        return container();
      } else if (container instanceof Element) {
        return container;
      } else if ("current" in container) {
        return container.current;
      } else if ("value" in container) {
        return container.value;
      }
    }
    /**
     * @sort 1
     */
    var DragScroll = /*#__PURE__*/function (_super) {
      __extends(DragScroll, _super);
      function DragScroll() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._startRect = null;
        _this._startPos = [];
        _this._prevTime = 0;
        _this._timer = 0;
        _this._prevScrollPos = [0, 0];
        _this._isWait = false;
        _this._flag = false;
        _this._currentOptions = null;
        _this._lock = false;
        _this._unregister = null;
        _this._onScroll = function () {
          var options = _this._currentOptions;
          if (_this._lock || !options) {
            return;
          }
          _this.emit("scrollDrag", {
            next: function (inputEvent) {
              _this.checkScroll({
                container: options.container,
                inputEvent: inputEvent
              });
            }
          });
        };
        return _this;
      }
      /**
       */
      var __proto = DragScroll.prototype;
      __proto.dragStart = function (e, options) {
        var container = getContainerElement(options.container);
        if (!container) {
          this._flag = false;
          return;
        }
        var top = 0;
        var left = 0;
        var width = 0;
        var height = 0;
        if (container === document.body) {
          width = window.innerWidth;
          height = window.innerHeight;
        } else {
          var rect = container.getBoundingClientRect();
          top = rect.top;
          left = rect.left;
          width = rect.width;
          height = rect.height;
        }
        this._flag = true;
        this._startPos = [e.clientX, e.clientY];
        this._startRect = {
          top: top,
          left: left,
          width: width,
          height: height
        };
        this._prevScrollPos = this._getScrollPosition([0, 0], options);
        this._currentOptions = options;
        this._registerScrollEvent(options);
      };
      __proto.drag = function (e, options) {
        clearTimeout(this._timer);
        if (!this._flag) {
          return;
        }
        var clientX = e.clientX,
          clientY = e.clientY;
        var _a = options.threshold,
          threshold = _a === void 0 ? 0 : _a;
        var _b = this,
          _startRect = _b._startRect,
          _startPos = _b._startPos;
        this._currentOptions = options;
        var direction = [0, 0];
        if (_startRect.top > clientY - threshold) {
          if (_startPos[1] > _startRect.top || clientY < _startPos[1]) {
            direction[1] = -1;
          }
        } else if (_startRect.top + _startRect.height < clientY + threshold) {
          if (_startPos[1] < _startRect.top + _startRect.height || clientY > _startPos[1]) {
            direction[1] = 1;
          }
        }
        if (_startRect.left > clientX - threshold) {
          if (_startPos[0] > _startRect.left || clientX < _startPos[0]) {
            direction[0] = -1;
          }
        } else if (_startRect.left + _startRect.width < clientX + threshold) {
          if (_startPos[0] < _startRect.left + _startRect.width || clientX > _startPos[0]) {
            direction[0] = 1;
          }
        }
        if (!direction[0] && !direction[1]) {
          return false;
        }
        return this._continueDrag(__assign(__assign({}, options), {
          direction: direction,
          inputEvent: e,
          isDrag: true
        }));
      };
      /**
       */
      __proto.checkScroll = function (options) {
        var _this = this;
        if (this._isWait) {
          return false;
        }
        var _a = options.prevScrollPos,
          prevScrollPos = _a === void 0 ? this._prevScrollPos : _a,
          direction = options.direction,
          _b = options.throttleTime,
          throttleTime = _b === void 0 ? 0 : _b,
          inputEvent = options.inputEvent,
          isDrag = options.isDrag;
        var nextScrollPos = this._getScrollPosition(direction || [0, 0], options);
        var offsetX = nextScrollPos[0] - prevScrollPos[0];
        var offsetY = nextScrollPos[1] - prevScrollPos[1];
        var nextDirection = direction || [offsetX ? Math.abs(offsetX) / offsetX : 0, offsetY ? Math.abs(offsetY) / offsetY : 0];
        this._prevScrollPos = nextScrollPos;
        this._lock = false;
        if (!offsetX && !offsetY) {
          return false;
        }
        /**
         * @event DragScroll#move
         */
        this.emit("move", {
          offsetX: nextDirection[0] ? offsetX : 0,
          offsetY: nextDirection[1] ? offsetY : 0,
          inputEvent: inputEvent
        });
        if (throttleTime && isDrag) {
          clearTimeout(this._timer);
          this._timer = window.setTimeout(function () {
            _this._continueDrag(options);
          }, throttleTime);
        }
        return true;
      };
      /**
       *
       */
      __proto.dragEnd = function () {
        this._flag = false;
        this._lock = false;
        clearTimeout(this._timer);
        this._unregisterScrollEvent();
      };
      __proto._getScrollPosition = function (direction, options) {
        var container = options.container,
          _a = options.getScrollPosition,
          getScrollPosition = _a === void 0 ? getDefaultScrollPosition : _a;
        return getScrollPosition({
          container: getContainerElement(container),
          direction: direction
        });
      };
      __proto._continueDrag = function (options) {
        var _this = this;
        var _a;
        var container = options.container,
          direction = options.direction,
          throttleTime = options.throttleTime,
          useScroll = options.useScroll,
          isDrag = options.isDrag,
          inputEvent = options.inputEvent;
        if (!this._flag || isDrag && this._isWait) {
          return;
        }
        var nowTime = now();
        var distTime = Math.max(throttleTime + this._prevTime - nowTime, 0);
        if (distTime > 0) {
          clearTimeout(this._timer);
          this._timer = window.setTimeout(function () {
            _this._continueDrag(options);
          }, distTime);
          return false;
        }
        this._prevTime = nowTime;
        var prevScrollPos = this._getScrollPosition(direction, options);
        this._prevScrollPos = prevScrollPos;
        if (isDrag) {
          this._isWait = true;
        }
        // unregister native scroll event
        if (!useScroll) {
          this._lock = true;
        }
        var param = {
          container: getContainerElement(container),
          direction: direction,
          inputEvent: inputEvent
        };
        (_a = options.requestScroll) === null || _a === void 0 ? void 0 : _a.call(options, param);
        /**
         * @event DragScroll#scroll
         */
        this.emit("scroll", param);
        this._isWait = false;
        return useScroll || this.checkScroll(__assign(__assign({}, options), {
          prevScrollPos: prevScrollPos,
          direction: direction,
          inputEvent: inputEvent
        }));
      };
      __proto._registerScrollEvent = function (options) {
        this._unregisterScrollEvent();
        var checkScrollEvent = options.checkScrollEvent;
        if (!checkScrollEvent) {
          return;
        }
        var callback = checkScrollEvent === true ? checkDefaultScrollEvent : checkScrollEvent;
        var container = getContainerElement(options.container);
        if (checkScrollEvent === true && (container === document.body || container === document.documentElement)) {
          this._unregister = checkDefaultScrollEvent(window, this._onScroll);
        } else {
          this._unregister = callback(container, this._onScroll);
        }
      };
      __proto._unregisterScrollEvent = function () {
        var _a;
        (_a = this._unregister) === null || _a === void 0 ? void 0 : _a.call(this);
        this._unregister = null;
      };
      return DragScroll;
    }(EventEmitter);

    return DragScroll;

})));
//# sourceMappingURL=dragscroll.js.map
