import React from 'react';
import styled from 'styled-components';
const StyledWrapper = styled.div `
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
export const PlusMinusIcon = (props) => {
    const { isCollapsed, style, className } = props;
    return (React.createElement(StyledWrapper, { className: className, style: style }, isCollapsed ? '+' : '-'));
};
