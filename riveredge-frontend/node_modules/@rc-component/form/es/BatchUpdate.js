import * as React from 'react';
const BatchUpdate = /*#__PURE__*/React.forwardRef((_, ref) => {
  const [batchInfo, setBatchInfo] = React.useState({});
  React.useLayoutEffect(() => {
    const keys = Object.keys(batchInfo);
    if (keys.length) {
      keys.forEach(key => {
        batchInfo[key]?.();
      });
      setBatchInfo({});
    }
  }, [batchInfo]);
  React.useImperativeHandle(ref, () => ({
    batch: (key, callback) => {
      setBatchInfo(ori => ({
        ...ori,
        [key]: callback
      }));
    }
  }));
  return null;
});
export default BatchUpdate;