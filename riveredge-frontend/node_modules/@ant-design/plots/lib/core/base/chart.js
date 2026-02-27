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
exports.Chart = void 0;
var g2_extension_plot_1 = require("@antv/g2-extension-plot");
var g2_1 = require("@antv/g2");
exports.Chart = (0, g2_1.extend)(g2_1.Runtime, __assign(__assign({}, (0, g2_1.stdlib)()), (0, g2_extension_plot_1.plotlib)()));
