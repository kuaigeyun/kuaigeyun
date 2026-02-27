import React from 'react';
import styled from 'styled-components';
const StyledWrapper = styled.div `
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
export const ArrowCountIcon = (props) => {
    const { className, style, graph, data, isCollapsed, countType = 'descendant', placement = 'bottom' } = props;
    const color = graph.getNodeData(data.id).style?.color || '#99ADD1';
    const count = (countType === 'descendant' ? graph.getDescendantsData(data.id) : graph.getChildrenData(data.id))
        .length;
    return (React.createElement(StyledWrapper, { "$color": color, "$isCollapsed": isCollapsed, "$placement": placement, className: `arrow-count-icon ${isCollapsed ? `arrow-count-icon-collapsed` : ''} ${className || ''}`, style: style },
        React.createElement("div", { className: "arrow-count-icon-bar" }),
        React.createElement("div", { className: "arrow-count-icon-circle" }, isCollapsed ? (count) : (React.createElement("div", { className: "arrow-count-icon-circle-arrow" },
            React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none" },
                React.createElement("path", { d: "M11,4 L5.5,8 L11,12", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })))))));
};
