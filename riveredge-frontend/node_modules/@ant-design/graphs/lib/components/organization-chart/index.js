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
exports.OrganizationChart = void 0;
const react_1 = __importStar(require("react"));
const base_graph_1 = require("../../core/base-graph");
const constants_1 = require("../../core/constants");
const options_1 = require("../../core/utils/options");
const options_2 = require("./options");
exports.OrganizationChart = (0, react_1.forwardRef)(({ children, ...props }, ref) => {
    const options = (0, react_1.useMemo)(() => {
        const { direction = 'vertical', labelField, ...restProps } = props;
        const options = (0, options_1.mergeOptions)(constants_1.COMMON_OPTIONS, options_2.DEFAULT_OPTIONS, (0, options_2.getOrganizationChartOptions)({ direction, labelField }), restProps);
        return options;
    }, [props]);
    return (react_1.default.createElement(base_graph_1.BaseGraph, { ...options, ref: ref }, children));
});
