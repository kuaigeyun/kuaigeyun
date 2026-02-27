"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWidget = exports.extraSchemaList = void 0;
exports.getWidgetName = getWidgetName;
exports.mapping = void 0;
var mapping = exports.mapping = {
  default: 'input',
  string: 'input',
  array: 'list',
  boolean: 'checkbox',
  integer: 'number',
  number: 'inputNumber',
  object: 'map',
  html: 'html',
  card: 'card',
  collapse: 'collapse',
  lineTitle: 'lineTitle',
  line: 'line',
  subItem: 'subItem',
  panel: 'panel',
  'string:upload': 'upload',
  'string:url': 'urlInput',
  'string:dateTime': 'datePicker',
  'string:date': 'datePicker',
  'string:year': 'datePicker',
  'string:month': 'datePicker',
  'string:week': 'datePicker',
  'string:quarter': 'datePicker',
  'string:time': 'timePicker',
  'string:textarea': 'textArea',
  'string:color': 'color',
  'string:image': 'imageInput',
  'range:time': 'timeRange',
  'range:dateTime': 'dateRange',
  'range:date': 'dateRange',
  'range:year': 'dateRange',
  'range:month': 'dateRange',
  'range:week': 'dateRange',
  'range:quarter': 'dateRange',
  '*?enum': 'radio',
  '*?enum_long': 'select',
  'array?enum': 'checkboxes',
  'array?enum_long': 'multiSelect',
  '*?readOnly': 'html' // TODO: html widgets for list / object
};
function getWidgetName(schema) {
  var _mapping = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mapping;
  var type = schema.type,
    format = schema.format,
    enums = schema.enum,
    readOnly = schema.readOnly,
    widget = schema.widget,
    props = schema.props;
  //如果已经注明了渲染widget，那最好
  if (schema['ui:widget'] || schema.widget) {
    return schema['ui:widget'] || schema.widget;
  }
  var list = [];
  if (readOnly) {
    list.push("".concat(type, "?readOnly"));
    list.push('*?readOnly');
  }
  if (enums) {
    // 根据 enum 长度来智能选择控件
    if (Array.isArray(enums) && (type === 'array' && enums.length > 6 || type !== 'array' && enums.length > 2)) {
      list.push("".concat(type, "?enum_long"));
      list.push('*?enum_long');
    } else {
      list.push("".concat(type, "?enum"));
      // array 默认使用 list，array?enum 默认使用 checkboxes，*?enum 默认使用select
      list.push('*?enum');
    }
  }
  if (props === null || props === void 0 ? void 0 : props.options) {
    if (type === 'array' && props.options.length > 6 || type !== 'array' && props.options.length > 2) {
      list.push("".concat(type, "?enum_long"));
      list.push('*?enum_long');
    } else {
      list.push("".concat(type, "?enum"));
      // array 默认使用 list，array?enum 默认使用 checkboxes，*?enum 默认使用select
      list.push('*?enum');
    }
  }
  var _widget = format;
  if (_widget) {
    list.push("".concat(type, ":").concat(_widget));
  }
  if (type === 'object') {
    list.push((schema.theme === 'tile' ? 'lineTitle' : schema.theme) || 'collapse');
  } else {
    list.push(type); // 放在最后兜底，其他都不match时使用type默认的组件
  }
  var widgetName = '';
  list.some(function (item) {
    widgetName = _mapping[item];
    return !!widgetName;
  });
  return widgetName;
}
function capitalizeFirstLetter(str) {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
var getWidget = exports.getWidget = function getWidget(name, widgets) {
  var widget = widgets[name];
  // name 转成首字母大写
  if (!widget) {
    widget = widgets[capitalizeFirstLetter(name)];
  }
  if (!widget) {
    widget = widgets['Html'] || null;
  }
  return widget;
};
var extraSchemaList = exports.extraSchemaList = {
  checkbox: {
    valuePropName: 'checked'
  },
  switch: {
    valuePropName: 'checked'
  }
};