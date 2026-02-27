"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlusMinusIcon = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const StyledWrapper = styled_components_1.default.div `
  height: 16px;
  width: 16px;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 50%;
  border: 2px solid #99add1;
  color: #99add1;
  font-weight: 800;
  line-height: 14px;
  text-align: center;
  box-sizing: content-box;
`;
const PlusMinusIcon = (props) => {
    const { isCollapsed, style, className } = props;
    return (react_1.default.createElement(StyledWrapper, { className: className, style: style }, isCollapsed ? '+' : '-'));
};
exports.PlusMinusIcon = PlusMinusIcon;
