/*
Copyright (c) 2019 Daybrush
name: @scena/event-emitter
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/gesture.git
version: 1.0.5
*/
'use strict';

var utils = require('@daybrush/utils');

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
    if (utils.isObject(eventName)) {
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
    } else if (utils.isObject(eventName)) {
      for (var name in eventName) {
        this.off(name);
      }
    } else if (!listener) {
      this._events[eventName] = [];
    } else {
      var events = this._events[eventName];

      if (events) {
        var index = utils.findIndex(events, function (e) {
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
    listeners.push(__assign({
      listener: listener
    }, options));
  };

  return EventEmitter;
}();

var modules = {
    __proto__: null,
    'default': EventEmitter
};

for (var name in modules) {
  EventEmitter[name] = modules[name];
}

module.exports = EventEmitter;
//# sourceMappingURL=event-emitter.cjs.js.map
