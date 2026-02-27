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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNode = void 0;
const charts_util_1 = require("@ant-design/charts-util");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const color_1 = require("../../utils/color");
const StyledWrapper = styled_components_1.default.div `
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-wrap: anywhere;
  line-height: 1.5em;
  text-align: center;
  height: inherit;
  width: inherit;
  box-sizing: content-box;
  font-size: 14px;

  ${({ $type, $color, $borderWidth }) => {
    switch ($type) {
        case 'normal':
            return `
          color: ${$color};
        `;
        case 'filled':
            return (0, styled_components_1.css) `
          color: #fff;
          background-color: ${$color};
          border-radius: 8px;
        `;
        case 'outlined':
            return (0, styled_components_1.css) `
          height: calc(100% - 2 * ${$borderWidth}px);
          width: calc(100% - 2 * ${$borderWidth}px);
          color: ${$color};
          background-color: #fff;
          border: ${$borderWidth}px solid ${$color};
          border-radius: 8px;
        `;
        case 'underlined':
            return (0, styled_components_1.css) `
          height: calc(100% - ${$borderWidth}px / 2);
          width: inherit;
          border-bottom: ${$borderWidth}px solid ${$color};
          background-color: #fff;
          color: ${$color};
        `;
    }
}}

  ${({ $isActive, $isSelected, $borderWidth, $color }) => ($isActive || $isSelected) &&
    (0, styled_components_1.css) `
      height: calc(100% - 2 * ${$borderWidth}px);
      width: calc(100% - 2 * ${$borderWidth}px);
      border: ${$borderWidth}px solid ${(0, color_1.darkenHexColor)($color, 100)};
      ${$isSelected && `box-shadow: 0 0 0 2px ${(0, color_1.hexToRgba)($color, 0.1)};`}
    `}
`;
const TextNode = (props) => {
    const { className, style = {}, type = 'normal', text = '', font, color = '#1783ff', borderWidth = 3, maxWidth = Infinity, isActive = false, isSelected = false, } = props;
    const isMultiLine = (0, charts_util_1.measureTextWidth)(text, font) > maxWidth;
    return (react_1.default.createElement(StyledWrapper, { "$type": type, "$color": color, "$borderWidth": borderWidth, "$isActive": isActive, "$isSelected": isSelected, className: `text-node text-node-${type} ${className || ''}`, style: { ...style, ...font } },
        react_1.default.createElement("div", { style: isMultiLine ? { width: 'calc(100% - 12px)' } : {} }, text)));
};
exports.TextNode = TextNode;
