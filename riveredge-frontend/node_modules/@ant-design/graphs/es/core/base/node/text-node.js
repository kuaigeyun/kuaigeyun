import { measureTextWidth } from '@ant-design/charts-util';
import React from 'react';
import styled, { css } from 'styled-components';
import { darkenHexColor, hexToRgba } from '../../utils/color';
const StyledWrapper = styled.div `
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
            return css `
          color: #fff;
          background-color: ${$color};
          border-radius: 8px;
        `;
        case 'outlined':
            return css `
          height: calc(100% - 2 * ${$borderWidth}px);
          width: calc(100% - 2 * ${$borderWidth}px);
          color: ${$color};
          background-color: #fff;
          border: ${$borderWidth}px solid ${$color};
          border-radius: 8px;
        `;
        case 'underlined':
            return css `
          height: calc(100% - ${$borderWidth}px / 2);
          width: inherit;
          border-bottom: ${$borderWidth}px solid ${$color};
          background-color: #fff;
          color: ${$color};
        `;
    }
}}

  ${({ $isActive, $isSelected, $borderWidth, $color }) => ($isActive || $isSelected) &&
    css `
      height: calc(100% - 2 * ${$borderWidth}px);
      width: calc(100% - 2 * ${$borderWidth}px);
      border: ${$borderWidth}px solid ${darkenHexColor($color, 100)};
      ${$isSelected && `box-shadow: 0 0 0 2px ${hexToRgba($color, 0.1)};`}
    `}
`;
export const TextNode = (props) => {
    const { className, style = {}, type = 'normal', text = '', font, color = '#1783ff', borderWidth = 3, maxWidth = Infinity, isActive = false, isSelected = false, } = props;
    const isMultiLine = measureTextWidth(text, font) > maxWidth;
    return (React.createElement(StyledWrapper, { "$type": type, "$color": color, "$borderWidth": borderWidth, "$isActive": isActive, "$isSelected": isSelected, className: `text-node text-node-${type} ${className || ''}`, style: { ...style, ...font } },
        React.createElement("div", { style: isMultiLine ? { width: 'calc(100% - 12px)' } : {} }, text)));
};
