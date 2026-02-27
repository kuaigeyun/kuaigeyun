import React, { forwardRef } from 'react';
import useForm from '../models/useForm';
export default (function (Component) {
  return /*#__PURE__*/forwardRef(function (props, ref) {
    var form = useForm();
    return /*#__PURE__*/React.createElement(Component, Object.assign({
      ref: ref
    }, props, {
      form: form
    }));
  });
});