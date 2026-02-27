"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scale;
var _1 = require(".");
function scale(props) {
    var yField = props.yField, data = props.data;
    var noDomainMax = (0, _1.isArray)(data) && data.length > 0 && (0, _1.isString)(yField) && !(0, _1.get)(props, 'scale.y.domainMax');
    var newProps = Object.isFrozen(props) ? __assign({}, props) : props;
    if (noDomainMax && data.reduce(function (acc, item) { return acc + item[yField]; }, 0) === 0) {
        (0, _1.set)(newProps, 'scale.y.domainMax', 1);
    }
    else if (noDomainMax && data.reduce(function (acc, item) { return acc + item[yField]; }, 0) !== 0) {
        (0, _1.set)(newProps, 'scale.y.domainMax', undefined);
    }
    return newProps;
}
