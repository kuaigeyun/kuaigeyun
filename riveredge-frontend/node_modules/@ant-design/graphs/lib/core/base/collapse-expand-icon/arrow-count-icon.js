"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowCountIcon = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const StyledWrapper = styled_components_1.default.div `
  ${({ $placement }) => {
    switch ($placement) {
        case 'top':
            return 'transform: translate(-50%, -100%); flex-direction: column-reverse;';
        case 'right':
            return 'transform: translate(0, -50%);';
        case 'left':
            return 'transform: translate(-100%, -50%); flex-direction: row-reverse;';
        default:
            return 'transform: translate(-50%, 0); flex-direction: column;';
    }
}}

  .arrow-count-icon-bar {
    ${({ $placement }) => {
    const isVertical = $placement === 'top' || $placement === 'bottom';
    return isVertical ? 'width: 3px; height: 8px; margin: 0 7px;' : 'width: 8px; height: 3px; margin: 7px 0;';
}}
    background-color: ${({ $color }) => $color};
  }

  .arrow-count-icon-circle {
    width: 16px;
    height: 16px;
    color: #fff;
    font-weight: 600;
    font-size: 10px;
    line-height: ${({ $isCollapsed }) => ($isCollapsed ? '16px' : '14px')};
    text-align: center;
    background-color: ${({ $color }) => $color};
    border-radius: 50%;
  }

  .arrow-count-icon-circle-arrow {
    width: 16px;
    height: 16px;
    transform: ${({ $isCollapsed, $placement }) => {
    if ($isCollapsed)
        return 'none';
    switch ($placement) {
        case 'top':
            return 'translateY(1px) rotate(-90deg)';
        case 'right':
            return 'translateX(-1px) rotate(0deg)';
        case 'left':
            return 'translateX(1px) rotate(180deg)';
        default:
            return 'translateY(-1px) rotate(90deg)';
    }
}};
  }

  display: ${({ $isCollapsed }) => ($isCollapsed ? 'flex' : 'none')};

  .collapsible-node-wrapper:hover & {
    display: flex;
  }
`;
const ArrowCountIcon = (props) => {
    const { className, style, graph, data, isCollapsed, countType = 'descendant', placement = 'bottom' } = props;
    const color = graph.getNodeData(data.id).style?.color || '#99ADD1';
    const count = (countType === 'descendant' ? graph.getDescendantsData(data.id) : graph.getChildrenData(data.id))
        .length;
    return (react_1.default.createElement(StyledWrapper, { "$color": color, "$isCollapsed": isCollapsed, "$placement": placement, className: `arrow-count-icon ${isCollapsed ? `arrow-count-icon-collapsed` : ''} ${className || ''}`, style: style },
        react_1.default.createElement("div", { className: "arrow-count-icon-bar" }),
        react_1.default.createElement("div", { className: "arrow-count-icon-circle" }, isCollapsed ? (count) : (react_1.default.createElement("div", { className: "arrow-count-icon-circle-arrow" },
            react_1.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none" },
                react_1.default.createElement("path", { d: "M11,4 L5.5,8 L11,12", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })))))));
};
exports.ArrowCountIcon = ArrowCountIcon;
