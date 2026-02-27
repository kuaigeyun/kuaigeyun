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

var _Board = require('./Board');

var _Board2 = _interopRequireDefault(_Board);

var _Preview = require('./Preview');

var _Preview2 = _interopRequireDefault(_Preview);

var _Ribbon = require('./Ribbon');

var _Ribbon2 = _interopRequireDefault(_Ribbon);

var _Alpha = require('./Alpha');

var _Alpha2 = _interopRequireDefault(_Alpha);

var _Params = require('./Params');

var _Params2 = _interopRequireDefault(_Params);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _validationColor = require('./utils/validationColor');

var _validationColor2 = _interopRequireDefault(_validationColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

function noop() {}

var Panel = function (_React$Component) {
  _inherits(Panel, _React$Component);

  function Panel(props) {
    _classCallCheck(this, Panel);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var alpha = typeof props.alpha === 'undefined' ? props.defaultAlpha : Math.min(props.alpha, props.defaultAlpha);

    var color = new _color2["default"](props.color || props.defaultColor);

    _this.state = {
      color: color,
      alpha: alpha
    };
    return _this;
  }

  Panel.prototype.componentDidMount = function componentDidMount() {
    this.props.onMount(this.ref);
  };

  Panel.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.color) {
      var color = new _color2["default"](nextProps.color);
      this.setState({
        color: color
      });
    }
    if (nextProps.alpha !== undefined) {
      this.setState({
        alpha: nextProps.alpha
      });
    }
  };

  /**
   * 响应 alpha 的变更
   * @param  {Number} alpha Range 0~100
   */


  /**
   * color change
   * @param  {Object}  color      tinycolor instance
   * @param  {Boolean} syncParams Sync to <Params />
   */


  Panel.prototype.render = function render() {
    var _cx,
        _this2 = this;

    var _props = this.props,
        prefixCls = _props.prefixCls,
        enableAlpha = _props.enableAlpha;
    var _state = this.state,
        color = _state.color,
        alpha = _state.alpha;


    var wrapClasses = (0, _classnames2["default"])((_cx = {}, _defineProperty(_cx, prefixCls + '-wrap', true), _defineProperty(_cx, prefixCls + '-wrap-has-alpha', enableAlpha), _cx));

    return _react2["default"].createElement(
      'div',
      {
        ref: function ref(_ref) {
          return _this2.ref = _ref;
        },
        className: [prefixCls, this.props.className].join(' '),
        style: this.props.style,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        tabIndex: '0'
      },
      _react2["default"].createElement(
        'div',
        { className: prefixCls + '-inner' },
        _react2["default"].createElement(_Board2["default"], { rootPrefixCls: prefixCls, color: color, onChange: this.handleChange }),
        _react2["default"].createElement(
          'div',
          { className: wrapClasses },
          _react2["default"].createElement(
            'div',
            { className: prefixCls + '-wrap-ribbon' },
            _react2["default"].createElement(_Ribbon2["default"], { rootPrefixCls: prefixCls, color: color, onChange: this.handleChange })
          ),
          enableAlpha && _react2["default"].createElement(
            'div',
            { className: prefixCls + '-wrap-alpha' },
            _react2["default"].createElement(_Alpha2["default"], {
              rootPrefixCls: prefixCls,
              alpha: alpha,
              color: color,
              onChange: this.handleAlphaChange
            })
          ),
          _react2["default"].createElement(
            'div',
            { className: prefixCls + '-wrap-preview' },
            _react2["default"].createElement(_Preview2["default"], {
              rootPrefixCls: prefixCls,
              alpha: alpha,
              onChange: this.handleChange,
              onInputClick: this.onSystemColorPickerOpen,
              color: color
            })
          )
        ),
        _react2["default"].createElement(
          'div',
          { className: prefixCls + '-wrap', style: { height: 40, marginTop: 6 } },
          _react2["default"].createElement(_Params2["default"], {
            rootPrefixCls: prefixCls,
            color: color,
            alpha: alpha,
            onAlphaChange: this.handleAlphaChange,
            onChange: this.handleChange,
            mode: this.props.mode,
            enableAlpha: this.props.enableAlpha
          })
        )
      )
    );
  };

  return Panel;
}(_react2["default"].Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onSystemColorPickerOpen = function (e) {
    // only work with broswer which support color input
    if (e.target.type === 'color') {
      _this3.systemColorPickerOpen = true;
    }
  };

  this.onFocus = function () {
    if (_this3._blurTimer) {
      clearTimeout(_this3._blurTimer);
      _this3._blurTimer = null;
    } else {
      _this3.props.onFocus();
    }
  };

  this.onBlur = function () {
    if (_this3._blurTimer) {
      clearTimeout(_this3._blurTimer);
    }
    _this3._blurTimer = setTimeout(function () {
      // if is system color picker open, then stop run blur
      if (_this3.systemColorPickerOpen) {
        _this3.systemColorPickerOpen = false;
        return;
      }

      _this3.props.onBlur();
    }, 100);
  };

  this.handleAlphaChange = function (alpha) {
    var color = _this3.state.color;

    color.alpha = alpha;

    _this3.setState({
      alpha: alpha,
      color: color
    });
    _this3.props.onChange({
      color: color.toHexString(),
      alpha: alpha
    });
  };

  this.handleChange = function (color) {
    var alpha = _this3.state.alpha;

    color.alpha = alpha;

    _this3.setState({ color: color });
    _this3.props.onChange({
      color: color.toHexString(),
      alpha: color.alpha
    });
  };
};

exports["default"] = Panel;


Panel.propTypes = {
  alpha: _propTypes2["default"].number,
  className: _propTypes2["default"].string,
  color: _validationColor2["default"], // Hex string
  defaultAlpha: _propTypes2["default"].number,
  defaultColor: _validationColor2["default"], // Hex string
  enableAlpha: _propTypes2["default"].bool,
  mode: _propTypes2["default"].oneOf(['RGB', 'HSL', 'HSB']),
  onBlur: _propTypes2["default"].func,
  onChange: _propTypes2["default"].func,
  onFocus: _propTypes2["default"].func,
  onMount: _propTypes2["default"].func,
  prefixCls: _propTypes2["default"].string,
  style: _propTypes2["default"].object
};

Panel.defaultProps = {
  className: '',
  defaultAlpha: 100,
  defaultColor: '#ff0000',
  enableAlpha: true,
  mode: 'RGB',
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  onMount: noop,
  prefixCls: 'rc-color-picker-panel',
  style: {}
};
module.exports = exports['default'];