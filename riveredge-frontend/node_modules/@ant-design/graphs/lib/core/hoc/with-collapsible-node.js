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
exports.withCollapsibleNode = void 0;
const g6_1 = require("@antv/g6");
const lodash_1 = require("lodash");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const StyledWrapper = styled_components_1.default.div `
  position: relative;
  height: inherit;
  width: inherit;
`;
const StyledIconWrapper = styled_components_1.default.div `
  position: absolute;
  z-index: 10;

  &:hover {
    cursor: pointer;
  }

  ${({ $placement, $offsetX, $offsetY }) => {
    const positions = {
        top: `left: calc(50% + ${$offsetX}px); top: ${$offsetY}px;`,
        bottom: `left: calc(50% + ${$offsetX}px); top: calc(100% + ${$offsetY}px);`,
        right: `left: calc(100% + ${$offsetX}px); top: calc(50% + ${$offsetY}px);`,
        left: `left: ${$offsetX}px; top: calc(50% + ${$offsetY}px);`,
    };
    return (0, styled_components_1.css) `
      ${positions[$placement]}
    `;
}}
`;
const withCollapsibleNode = (NodeComponent) => {
    return (props) => {
        const { data, graph, trigger, iconRender, iconPlacement, iconOffsetX, iconOffsetY, iconClassName, iconStyle, refreshLayout, } = props;
        const [isCollapsed, setIsCollapsed] = (0, react_1.useState)((0, lodash_1.get)(data, 'style.collapsed', false));
        const wrapperRef = (0, react_1.useRef)(null);
        const iconRef = (0, react_1.useRef)(null);
        const isIconShown = trigger === 'icon' && !(0, lodash_1.isEmpty)(data.children);
        const handleClickCollapse = async (e) => {
            e.stopPropagation();
            const toggleExpandCollapse = isCollapsed ? 'expandElement' : 'collapseElement';
            await graph[toggleExpandCollapse]((0, g6_1.idOf)(data));
            setIsCollapsed((prev) => !prev);
            if (refreshLayout) {
                await graph.layout();
            }
        };
        (0, react_1.useEffect)(() => {
            const target = trigger === 'icon' ? iconRef.current : trigger === 'node' ? wrapperRef.current : trigger;
            target?.addEventListener('click', handleClickCollapse);
            return () => {
                target?.removeEventListener('click', handleClickCollapse);
            };
        }, [trigger, isCollapsed]);
        const computeCallbackStyle = (callableStyle) => {
            return typeof callableStyle === 'function' ? callableStyle.call(graph, data) : callableStyle;
        };
        return (react_1.default.createElement(StyledWrapper, { ref: wrapperRef, className: "collapsible-node-wrapper" },
            isIconShown && (react_1.default.createElement(StyledIconWrapper, { ref: iconRef, "$placement": computeCallbackStyle(iconPlacement), "$offsetX": computeCallbackStyle(iconOffsetX), "$offsetY": computeCallbackStyle(iconOffsetY), className: iconClassName, style: iconStyle }, iconRender?.call(graph, isCollapsed, data))),
            NodeComponent.call(graph, data)));
    };
};
exports.withCollapsibleNode = withCollapsibleNode;
