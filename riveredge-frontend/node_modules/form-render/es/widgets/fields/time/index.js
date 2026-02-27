import { __rest } from "tslib";
import dayjs from 'dayjs';
import React from 'react';
import TimePicker from '../../components/TimePicker';
import { getFormat } from '../../utils';
import withFieldWrap from '../../utils/withFieldWrap';
var Time = function Time(_a) {
  var onChange = _a.onChange,
    _a$format = _a.format,
    format = _a$format === void 0 ? 'time' : _a$format,
    value = _a.value,
    style = _a.style,
    rest = __rest(_a, ["onChange", "format", "value", "style"]);
  var timeFormat = getFormat(format);
  var _value = value ? dayjs(value, timeFormat) : undefined;
  var handleChange = function handleChange(_, valueStr) {
    onChange(valueStr);
  };
  var timeParams = Object.assign({
    value: _value,
    style: Object.assign({
      width: '100%'
    }, style),
    onChange: handleChange,
    format: timeFormat
  }, rest);
  return /*#__PURE__*/React.createElement(TimePicker, Object.assign({}, timeParams));
};
export default withFieldWrap(Time);