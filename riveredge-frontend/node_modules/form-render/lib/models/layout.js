"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormItemLayout = void 0;
var getFormItemLayout = exports.getFormItemLayout = function getFormItemLayout(column, schema, _ref) {
  var labelWidth = _ref.labelWidth,
    displayType = _ref.displayType,
    _labelCol = _ref._labelCol,
    _fieldCol = _ref._fieldCol;
  var labelCol = {
    span: 5
  };
  var fieldCol = {
    span: 9
  };
  if (column === 2) {
    labelCol = {
      span: 6
    };
    fieldCol = {
      span: 14
    };
  }
  if (column > 2) {
    labelCol = {
      span: 7
    };
    fieldCol = {
      span: 16
    };
  }
  if (displayType === 'column') {
    // labelCol = { xl: 9, xxl: 6 };
    // if (column > 1) {
    //   labelCol = {};
    //   fieldCol = {};
    // }
    labelCol = {};
    fieldCol = {};
  }
  if (_labelCol) {
    labelCol = _labelCol;
    if (displayType === 'column') {
      labelCol = {};
    }
  }
  if (_fieldCol) {
    fieldCol = _fieldCol;
    if (typeof _fieldCol === 'number') {
      fieldCol = {
        span: _fieldCol
      };
    }
  }
  if (displayType === 'inline') {
    labelCol = {};
    fieldCol = {};
  }
  // 兼容一下 1.0 版本
  if ((labelWidth || labelWidth === 0) && displayType !== 'column') {
    labelCol = {
      flex: labelWidth + 'px'
    };
    fieldCol = {
      flex: 'auto'
    };
  }
  // 自定义进行覆盖
  if (schema.cellSpan) {
    fieldCol = {};
  }
  if (schema.labelCol || schema.labelCol === 0) {
    labelCol = schema.labelCol;
  }
  if (schema.fieldCol || schema.fieldCol === 0) {
    fieldCol = schema.fieldCol;
  }
  if (typeof labelCol === 'number') {
    labelCol = {
      span: labelCol
    };
  }
  if (typeof fieldCol === 'number') {
    fieldCol = {
      span: fieldCol
    };
  }
  return {
    labelCol: labelCol,
    fieldCol: fieldCol
  };
};