'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _color = require('./helpers/color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Preview = function (_React$Component) {
  _inherits(Preview, _React$Component);

  function Preview() {
    var _temp, _this, _ret;

    _classCallCheck(this, Preview);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onChange = function (e) {
      var value = e.target.value;
      var color = new _color2["default"](value);
      _this.props.onChange(color);
      e.stopPropagation();
    }, _this.getPrefixCls = function () {
      return _this.props.rootPrefixCls + '-preview';
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Preview.prototype.render = function render() {
    var prefixCls = this.getPrefixCls();
    var hex = this.props.color.toHexString();
    return _react2["default"].createElement(
      'div',
      { className: prefixCls },
      _react2["default"].createElement('span', {
        style: {
          backgroundColor: hex,
          opacity: this.props.alpha / 100
        }
      }),
      _react2["default"].createElement('input', {
        type: 'color',
        value: hex,
        onChange: this.onChange,
        onClick: this.props.onInputClick
      })
    );
  };

  return Preview;
}(_react2["default"].Component);

exports["default"] = Preview;


Preview.propTypes = {
  rootPrefixCls: _propTypes2["default"].string,
  color: _propTypes2["default"].object,
  alpha: _propTypes2["default"].number,
  onChange: _propTypes2["default"].func,
  onInputClick: _propTypes2["default"].func
};
module.exports = exports['default'];