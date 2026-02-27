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
exports.OrganizationChartNode = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const StyledWrapper = styled_components_1.default.div `
  height: inherit;
  width: inherit;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  border: none;
  background-color: #fff;
  box-sizing: content-box;

  ${(props) => props.$isActive &&
    (0, styled_components_1.css) `
      transform: translate(-3px, -3px);
      border: 2px solid #1783ff;
    `}

  .org-chart-node-line {
    width: 100%;
    height: 6px;
    background-color: ${(props) => props.$color};
    border-radius: 8px 8px 0 0;
  }

  .org-chart-node-content {
    height: calc(100% - 6px);
    margin: 0 16px 3px;
    display: flex;
    align-items: center;

    &-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 16px;
      background-color: ${(props) => props.$color};
      font-weight: 600;
      font-size: 18px;
      text-align: center;
      line-height: 40px;
      color: #fff;
    }

    &-detail {
      width: calc(100% - 56px);
    }

    &-name {
      color: #242424;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-post {
      color: #616161;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
const OrganizationChartNode = (props) => {
    const { name, position, status = 'online', isActive, className, style } = props;
    const colorMap = {
        online: '#1783FF',
        busy: '#00C9C9',
        offline: '#F08F56',
    };
    return (react_1.default.createElement(StyledWrapper, { "$color": colorMap[status], "$isActive": isActive, className: className, style: style },
        react_1.default.createElement("div", { className: "org-chart-node-line" }),
        react_1.default.createElement("div", { className: "org-chart-node-content" },
            react_1.default.createElement("div", { className: "org-chart-node-content-avatar" }, name.slice(0, 1)),
            react_1.default.createElement("div", { className: "org-chart-node-content-detail" },
                react_1.default.createElement("div", { className: "org-chart-node-content-name" }, name),
                position && react_1.default.createElement("div", { className: "org-chart-node-content-post" }, position)))));
};
exports.OrganizationChartNode = OrganizationChartNode;
