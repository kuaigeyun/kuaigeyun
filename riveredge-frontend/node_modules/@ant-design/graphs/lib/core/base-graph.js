"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGraph = void 0;
const charts_util_1 = require("@ant-design/charts-util");
const graphin_1 = require("@antv/graphin");
const lodash_1 = require("lodash");
const react_1 = __importStar(require("react"));
exports.BaseGraph = (0, react_1.forwardRef)(({ children, ...props }, ref) => {
    const { containerStyle, className, onInit, onReady, onDestroy, errorTemplate, loading, loadingTemplate, ...options } = props;
    const graphRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => graphRef.current);
    return (react_1.default.createElement(charts_util_1.ErrorBoundary, { errorTemplate: errorTemplate },
        loading && react_1.default.createElement(charts_util_1.ChartLoading, { loadingTemplate: loadingTemplate }),
        !(0, lodash_1.isEmpty)(options.data) && (react_1.default.createElement(graphin_1.Graphin, { ref: (ref) => {
                graphRef.current = ref;
            }, className: className, style: containerStyle, options: options, onInit: onInit, onReady: onReady, onDestroy: onDestroy }, children))));
});
