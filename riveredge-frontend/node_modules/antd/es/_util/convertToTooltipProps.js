import { isValidElement } from 'react';
import isNonNullable from './isNonNullable';
const convertToTooltipProps = tooltip => {
  if (!isNonNullable(tooltip)) {
    return null;
  }
  if (typeof tooltip === 'object' && ! /*#__PURE__*/isValidElement(tooltip)) {
    return tooltip;
  }
  return {
    title: tooltip
  };
};
export default convertToTooltipProps;