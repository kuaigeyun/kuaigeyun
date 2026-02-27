import { __rest } from "tslib";
/**
 * Updated by Tw93 on 2019-12-08.
 * 日历多选组件
 */
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import DatePicker from '../../components/DatePicker';
import { getFormat, transformDateValue } from '../../utils';
import withFieldWrap from '../../utils/withFieldWrap';
dayjs.extend(quarterOfYear);
var RangePicker = DatePicker.RangePicker;
var DateRange = function DateRange(_a) {
  var onChange = _a.onChange,
    format = _a.format,
    value = _a.value,
    style = _a.style,
    rest = __rest(_a, ["onChange", "format", "value", "style"]);
  var dateFormat = getFormat(format);
  var valueObj = useMemo(function () {
    if (!value) {
      return value;
    }
    return value.map(function (item) {
      return transformDateValue(item, format, dateFormat);
    });
  }, [value]);
  var handleChange = function handleChange(val, _stringList) {
    var stringList = _stringList;
    if (['week', 'quarter'].includes(format)) {
      stringList = (val || []).map(function (item) {
        return dayjs(item).format(dateFormat);
      });
    }
    var isPass = stringList.every(function (item) {
      return !!item;
    });
    if (!isPass) {
      stringList = null;
    }
    onChange(stringList);
  };
  var dateParams = {
    value: valueObj,
    style: Object.assign({
      width: '100%'
    }, style),
    onChange: handleChange
  };
  // TODO: format是在options里自定义的情况，是否要判断一下要不要showTime
  if (format === 'dateTime') {
    dateParams.showTime = true;
  }
  if (['week', 'month', 'quarter', 'year'].indexOf(format) > -1) {
    dateParams.picker = format;
  }
  dateParams = Object.assign(Object.assign({}, dateParams), rest);
  if (dateFormat === format) {
    dateParams.format = format;
  }
  return /*#__PURE__*/React.createElement(RangePicker, Object.assign({}, dateParams));
};
export default withFieldWrap(DateRange);