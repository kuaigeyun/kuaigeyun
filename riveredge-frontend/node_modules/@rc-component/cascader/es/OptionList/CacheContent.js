import * as React from 'react';
const CacheContent = /*#__PURE__*/React.memo(({
  children
}) => children, (_, next) => !next.open);
if (process.env.NODE_ENV !== 'production') {
  CacheContent.displayName = 'CacheContent';
}
export default CacheContent;