import { __rest } from "tslib";
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { getFormat, transformDateValue } from '../../utils';
import DatePicker from '../../components/DatePicker';
import withFieldWrap from '../../utils/withFieldWrap';
dayjs.extend(quarterOfYear);
var DateCmpt = function DateCmpt(_a) {
  var onChange = _a.onChange,
    format = _a.format,
    value = _a.value,
    style = _a.style,
    rest = __rest(_a, ["onChange", "format", "value", "style"]);
  var dateFormat = getFormat(format);
  var valueObj = useMemo(function () {
    return transformDateValue(value, format, dateFormat);
  }, [value]);
  var handleChange = function handleChange(dateValue, dateString) {
    var newValue = dateString;
    if (format === 'week' || format === 'quarter') {
      newValue = dayjs(dateValue).format(dateFormat);
    }
    onChange(newValue);
  };
  var dateParams = {
    value: valueObj,
    style: Object.assign({
      width: '100%'
    }, style),
    onChange: handleChange
  };
  // TODO: format 是在 options 里自定义的情况，是否要判断一下要不要 showTime
  if (format === 'dateTime') {
    dateParams.showTime = true;
  }
  if (['week', 'month', 'quarter', 'year'].indexOf(format) > -1) {
    dateParams.picker = format;
  }
  if (dateFormat === format) {
    dateParams.format = format;
  }
  return /*#__PURE__*/React.createElement(DatePicker, Object.assign({}, dateParams, rest));
};
export default withFieldWrap(DateCmpt);