"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _cssinjs = require("@ant-design/cssinjs");
const genStepsProgressStyle = token => {
  const {
    calc,
    antCls,
    componentCls,
    iconSize,
    iconSizeSM,
    lineWidthBold,
    paddingXXS
  } = token;
  const itemCls = `${componentCls}-item`;
  const progressSize = token.calc(iconSize).add(token.calc(lineWidthBold).mul(4).equal()).equal();
  const progressSizeSM = token.calc(iconSizeSM).add(token.calc(token.lineWidth).mul(4).equal()).equal();
  const enhanceSize = calc(lineWidthBold).add(lineWidthBold).equal();
  return {
    [`${componentCls}${componentCls}-with-progress`]: {
      '--steps-item-wrapper-padding-top': enhanceSize,
      [`${itemCls}${itemCls}-process`]: {
        [`${itemCls}-icon`]: {
          position: 'relative'
        }
      },
      [`${itemCls}-progress-icon`]: {
        '&-svg': {
          '--steps-svg-size': calc(enhanceSize).mul(2).add(`var(--steps-icon-size)`).equal(),
          '--icon-size-ptg-unitless': `calc(100 / tan(atan2(var(--steps-svg-size),1px)))`,
          fontSize: `var(--steps-svg-size)`,
          lineHeight: `var(--icon-size-ptg-unitless)`,
          position: 'absolute',
          inset: calc(enhanceSize).mul(-1).equal(),
          width: 'auto',
          height: 'auto'
        },
        '&-circle': {
          lineHeight: `var(--icon-size-ptg-unitless)`,
          strokeWidth: calc(`var(--icon-size-ptg-unitless)`).mul(lineWidthBold).equal(),
          '--progress-r': calc(`var(--steps-svg-size)`).sub(lineWidthBold).mul(`var(--icon-size-ptg-unitless)`).div(2).equal(),
          r: `var(--progress-r)`,
          fill: 'none',
          cx: 50,
          cy: 50,
          transition: `all ${token.motionDurationSlow} ease-in-out`,
          '&-rail': {
            stroke: token.colorSplit
          },
          '&-ptg': {
            stroke: token.colorPrimary
          }
        }
      }
    },
    [`&${componentCls}-with-progress11`]: {
      // ==========================================================
      // ==                        Shared                        ==
      // ==========================================================
      [itemCls]: {
        paddingTop: paddingXXS,
        paddingInlineStart: paddingXXS
      },
      [`${itemCls}-icon`]: {
        position: 'relative',
        [`${antCls}-progress`]: {
          position: 'absolute',
          left: {
            _skip_check_: true,
            value: '50%'
          },
          top: '50%',
          transform: 'translate(-50%, -50%)',
          '&-body': {
            width: `${(0, _cssinjs.unit)(progressSize)} !important`,
            height: `${(0, _cssinjs.unit)(progressSize)} !important`
          }
        }
      },
      [`&${componentCls}-small`]: {
        [`${itemCls}-icon ${antCls}-progress-body`]: {
          width: `${(0, _cssinjs.unit)(progressSizeSM)} !important`,
          height: `${(0, _cssinjs.unit)(progressSizeSM)} !important`
        }
      }
    }
  };
};
var _default = exports.default = genStepsProgressStyle;