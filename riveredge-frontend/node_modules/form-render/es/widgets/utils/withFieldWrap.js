import React from 'react';
var getProps = function getProps(props, filter) {
  var result = {};
  Object.keys(props).forEach(function (key) {
    if (filter.includes(key)) {
      return;
    }
    result[key] = props[key];
  });
  return result;
};
export default (function (Field) {
  var filterProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['addons', 'schema', 'dependValues'];
  return function (props) {
    return /*#__PURE__*/React.createElement(Field, Object.assign({}, getProps(props, filterProps)));
  };
});