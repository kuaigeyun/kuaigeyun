import * as React from 'react';
import DatePicker from '../DatePicker';
var TimePicker = /*#__PURE__*/React.forwardRef(function (props, ref) {
  return /*#__PURE__*/React.createElement(DatePicker, Object.assign({}, props, {
    picker: 'time',
    mode: undefined,
    ref: ref
  }));
});
TimePicker.displayName = 'TimePicker';
TimePicker.RangePicker = /*#__PURE__*/React.forwardRef(function (props, ref) {
  return /*#__PURE__*/React.createElement(DatePicker.RangePicker, Object.assign({}, props, {
    picker: 'time',
    mode: undefined,
    ref: ref
  }));
});
export default TimePicker;