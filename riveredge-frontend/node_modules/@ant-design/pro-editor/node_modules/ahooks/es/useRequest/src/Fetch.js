import { __assign, __awaiter, __generator, __read, __rest, __spreadArray } from "tslib";
/* eslint-disable @typescript-eslint/no-parameter-properties */
import { isFunction } from '../../utils';
var Fetch = /** @class */function () {
  function Fetch(serviceRef, options, subscribe, initState) {
    if (initState === void 0) {
      initState = {};
    }
    this.serviceRef = serviceRef;
    this.options = options;
    this.subscribe = subscribe;
    this.initState = initState;
    this.count = 0;
    this.state = {
      loading: false,
      params: undefined,
      data: undefined,
      error: undefined
    };
    this.state = __assign(__assign(__assign({}, this.state), {
      loading: !options.manual
    }), initState);
  }
  Fetch.prototype.setState = function (s) {
    if (s === void 0) {
      s = {};
    }
    this.state = __assign(__assign({}, this.state), s);
    this.subscribe();
  };
  Fetch.prototype.runPluginHandler = function (event) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      rest[_i - 1] = arguments[_i];
    }
    // @ts-ignore
    var r = this.pluginImpls.map(function (i) {
      var _a;
      return (_a = i[event]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([i], __read(rest), false));
    }).filter(Boolean);
    return Object.assign.apply(Object, __spreadArray([{}], __read(r), false));
  };
  Fetch.prototype.runAsync = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
      var currentCount, _l, _m, stopNow, _o, returnNow, state, servicePromise, res, error_1;
      var _p;
      return __generator(this, function (_q) {
        switch (_q.label) {
          case 0:
            this.count += 1;
            currentCount = this.count;
            _l = this.runPluginHandler('onBefore', params), _m = _l.stopNow, stopNow = _m === void 0 ? false : _m, _o = _l.returnNow, returnNow = _o === void 0 ? false : _o, state = __rest(_l, ["stopNow", "returnNow"]);
            // stop request
            if (stopNow) {
              return [2 /*return*/, new Promise(function () {})];
            }
            this.setState(__assign({
              loading: true,
              params: params
            }, state));
            // return now
            if (returnNow) {
              return [2 /*return*/, Promise.resolve(state.data)];
            }
            (_b = (_a = this.options).onBefore) === null || _b === void 0 ? void 0 : _b.call(_a, params);
            _q.label = 1;
          case 1:
            _q.trys.push([1, 3,, 4]);
            servicePromise = this.runPluginHandler('onRequest', this.serviceRef.current, params).servicePromise;
            if (!servicePromise) {
              servicePromise = (_p = this.serviceRef).current.apply(_p, __spreadArray([], __read(params), false));
            }
            return [4 /*yield*/, servicePromise];
          case 2:
            res = _q.sent();
            if (currentCount !== this.count) {
              // prevent run.then when request is canceled
              return [2 /*return*/, new Promise(function () {})];
            }
            // const formattedResult = this.options.formatResultRef.current ? this.options.formatResultRef.current(res) : res;
            this.setState({
              data: res,
              error: undefined,
              loading: false
            });
            (_d = (_c = this.options).onSuccess) === null || _d === void 0 ? void 0 : _d.call(_c, res, params);
            this.runPluginHandler('onSuccess', res, params);
            (_f = (_e = this.options).onFinally) === null || _f === void 0 ? void 0 : _f.call(_e, params, res, undefined);
            if (currentCount === this.count) {
              this.runPluginHandler('onFinally', params, res, undefined);
            }
            return [2 /*return*/, res];
          case 3:
            error_1 = _q.sent();
            if (currentCount !== this.count) {
              // prevent run.then when request is canceled
              return [2 /*return*/, new Promise(function () {})];
            }
            this.setState({
              error: error_1,
              loading: false
            });
            (_h = (_g = this.options).onError) === null || _h === void 0 ? void 0 : _h.call(_g, error_1, params);
            this.runPluginHandler('onError', error_1, params);
            (_k = (_j = this.options).onFinally) === null || _k === void 0 ? void 0 : _k.call(_j, params, undefined, error_1);
            if (currentCount === this.count) {
              this.runPluginHandler('onFinally', params, undefined, error_1);
            }
            throw error_1;
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };

  Fetch.prototype.run = function () {
    var _this = this;
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }
    this.runAsync.apply(this, __spreadArray([], __read(params), false)).catch(function (error) {
      if (!_this.options.onError) {
        console.error(error);
      }
    });
  };
  Fetch.prototype.cancel = function () {
    this.count += 1;
    this.setState({
      loading: false
    });
    this.runPluginHandler('onCancel');
  };
  Fetch.prototype.refresh = function () {
    // @ts-ignore
    this.run.apply(this, __spreadArray([], __read(this.state.params || []), false));
  };
  Fetch.prototype.refreshAsync = function () {
    // @ts-ignore
    return this.runAsync.apply(this, __spreadArray([], __read(this.state.params || []), false));
  };
  Fetch.prototype.mutate = function (data) {
    var targetData = isFunction(data) ? data(this.state.data) : data;
    this.runPluginHandler('onMutate', targetData);
    this.setState({
      data: targetData
    });
  };
  return Fetch;
}();
export default Fetch;