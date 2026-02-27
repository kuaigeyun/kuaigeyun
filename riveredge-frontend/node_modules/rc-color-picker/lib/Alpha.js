'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _addEventListener = require('rc-util/lib/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

function rgbaColor(r, g, b, a) {
  return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
}

var Alpha = function (_React$Component) {
  _inherits(Alpha, _React$Component);

  function Alpha(props) {
    _classCallCheck(this, Alpha);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onMouseDown = function (e) {
      var x = e.clientX;
      var y = e.clientY;

      _this.pointMoveTo({
        x: x,
        y: y
      });

      _this.dragListener = (0, _addEventListener2["default"])(window, 'mousemove', _this.onDrag);
      _this.dragUpListener = (0, _addEventListener2["default"])(window, 'mouseup', _this.onDragEnd);
    };

    _this.onDrag = function (e) {
      var x = e.clientX;
      var y = e.clientY;
      _this.pointMoveTo({
        x: x,
        y: y
      });
    };

    _this.onDragEnd = function (e) {
      var x = e.clientX;
      var y = e.clientY;
      _this.pointMoveTo({
        x: x,
        y: y
      });
      _this.removeListeners();
    };

    _this.getBackground = function () {
      var _this$props$color = _this.props.color,
          red = _this$props$color.red,
          green = _this$props$color.green,
          blue = _this$props$color.blue;

      var opacityGradient = 'linear-gradient(to right, ' + rgbaColor(red, green, blue, 0) + ' , ' + rgbaColor(red, green, blue, 100) + ')'; // eslint-disable-line max-len
      return opacityGradient;
    };

    _this.getPrefixCls = function () {
      return _this.props.rootPrefixCls + '-alpha';
    };

    _this.pointMoveTo = function (coords) {
      var rect = (0, _reactDom.findDOMNode)(_this).getBoundingClientRect();
      var width = rect.width;
      var left = coords.x - rect.left;

      left = Math.max(0, left);
      left = Math.min(left, width);

      var alpha = Math.round(left / width * 100);

      _this.props.onChange(alpha);
    };

    _this.removeListeners = function () {
      if (_this.dragListener) {
        _this.dragListener.remove();
        _this.dragListener = null;
      }
      if (_this.dragUpListener) {
        _this.dragUpListener.remove();
        _this.dragUpListener = null;
      }
    };

    return _this;
  }

  Alpha.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeListeners();
  };

  Alpha.prototype.render = function render() {
    var prefixCls = this.getPrefixCls();
    return _react2["default"].createElement(
      'div',
      { className: prefixCls },
      _react2["default"].createElement('div', { ref: 'bg', className: prefixCls + '-bg', style: { background: this.getBackground() } }),
      _react2["default"].createElement('span', { style: { left: this.props.alpha + '%' } }),
      _react2["default"].createElement('div', { className: prefixCls + '-handler', onMouseDown: this.onMouseDown })
    );
  };

  return Alpha;
}(_react2["default"].Component);

exports["default"] = Alpha;


Alpha.propTypes = {
  color: _propTypes2["default"].object,
  onChange: _propTypes2["default"].func,
  rootPrefixCls: _propTypes2["default"].string,
  alpha: _propTypes2["default"].number
};
module.exports = exports['default'];