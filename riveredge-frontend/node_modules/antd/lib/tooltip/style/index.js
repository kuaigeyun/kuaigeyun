"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareComponentToken = exports.default = void 0;
var _cssinjs = require("@ant-design/cssinjs");
var _style = require("../../style");
var _motion = require("../../style/motion");
var _placementArrow = _interopRequireWildcard(require("../../style/placementArrow"));
var _roundedArrow = require("../../style/roundedArrow");
var _internal = require("../../theme/internal");
const genTooltipStyle = token => {
  const {
    calc,
    componentCls,
    // ant-tooltip
    tooltipMaxWidth,
    tooltipColor,
    tooltipBg,
    tooltipBorderRadius,
    zIndexPopup,
    controlHeight,
    boxShadowSecondary,
    paddingSM,
    paddingXS,
    arrowOffsetHorizontal,
    sizePopupArrow
  } = token;
  // arrowOffsetHorizontal + arrowWidth + borderRadius
  const edgeAlignMinWidth = calc(tooltipBorderRadius).add(sizePopupArrow).add(arrowOffsetHorizontal).equal();
  // borderRadius * 2 + arrowWidth
  const centerAlignMinWidth = calc(tooltipBorderRadius).mul(2).add(sizePopupArrow).equal();
  const sharedBodyStyle = {
    minWidth: centerAlignMinWidth,
    minHeight: controlHeight,
    padding: `${(0, _cssinjs.unit)(token.calc(paddingSM).div(2).equal())} ${(0, _cssinjs.unit)(paddingXS)}`,
    color: `var(--ant-tooltip-color, ${tooltipColor})`,
    textAlign: 'start',
    textDecoration: 'none',
    wordWrap: 'break-word',
    backgroundColor: tooltipBg,
    borderRadius: tooltipBorderRadius,
    boxShadow: boxShadowSecondary,
    boxSizing: 'border-box'
  };
  const sharedTransformOrigin = {
    // When use `autoArrow`, origin will follow the arrow position
    '--valid-offset-x': 'var(--arrow-offset-horizontal, var(--arrow-x))',
    transformOrigin: [`var(--valid-offset-x, 50%)`, `var(--arrow-y, 50%)`].join(' ')
  };
  return [{
    [componentCls]: {
      ...(0, _style.resetComponent)(token),
      position: 'absolute',
      zIndex: zIndexPopup,
      display: 'block',
      width: 'max-content',
      maxWidth: tooltipMaxWidth,
      visibility: 'visible',
      ...sharedTransformOrigin,
      '&-hidden': {
        display: 'none'
      },
      '--antd-arrow-background-color': tooltipBg,
      // Wrapper for the tooltip content
      [`${componentCls}-container`]: [sharedBodyStyle, (0, _motion.initFadeMotion)(token, true)],
      [`&:has(~ ${componentCls}-unique-container)`]: {
        [`${componentCls}-container`]: {
          border: 'none',
          background: 'transparent',
          boxShadow: 'none'
        }
      },
      // Align placement should have another min width
      [[`&-placement-topLeft`, `&-placement-topRight`, `&-placement-bottomLeft`, `&-placement-bottomRight`].join(',')]: {
        minWidth: edgeAlignMinWidth
      },
      // Limit left and right placement radius
      [[`&-placement-left`, `&-placement-leftTop`, `&-placement-leftBottom`, `&-placement-right`, `&-placement-rightTop`, `&-placement-rightBottom`].join(',')]: {
        [`${componentCls}-inner`]: {
          borderRadius: token.min(tooltipBorderRadius, _placementArrow.MAX_VERTICAL_CONTENT_RADIUS)
        }
      },
      [`${componentCls}-content`]: {
        position: 'relative'
      },
      // generator for preset color
      ...(0, _internal.genPresetColor)(token, (colorKey, {
        darkColor
      }) => ({
        [`&${componentCls}-${colorKey}`]: {
          [`${componentCls}-container`]: {
            backgroundColor: darkColor
          },
          [`${componentCls}-arrow`]: {
            '--antd-arrow-background-color': darkColor
          }
        }
      })),
      // RTL
      '&-rtl': {
        direction: 'rtl'
      }
    }
  },
  // Arrow Style
  (0, _placementArrow.default)(token, 'var(--antd-arrow-background-color)'),
  // Pure Render
  {
    [`${componentCls}-pure`]: {
      position: 'relative',
      maxWidth: 'none',
      margin: token.sizePopupArrow
    }
  },
  // Unique Body
  {
    [`${componentCls}-unique-container`]: {
      ...sharedBodyStyle,
      ...sharedTransformOrigin,
      position: 'absolute',
      zIndex: calc(zIndexPopup).sub(1).equal(),
      '&-hidden': {
        display: 'none'
      },
      '&-visible': {
        transition: `all ${token.motionDurationSlow}`
      }
    }
  }];
};
// ============================== Export ==============================
const prepareComponentToken = token => ({
  zIndexPopup: token.zIndexPopupBase + 70,
  ...(0, _placementArrow.getArrowOffsetToken)({
    contentRadius: token.borderRadius,
    limitVerticalRadius: true
  }),
  ...(0, _roundedArrow.getArrowToken)((0, _internal.mergeToken)(token, {
    borderRadiusOuter: Math.min(token.borderRadiusOuter, 4)
  }))
});
exports.prepareComponentToken = prepareComponentToken;
var _default = (prefixCls, rootCls, injectStyle = true) => {
  const useStyle = (0, _internal.genStyleHooks)('Tooltip', token => {
    const {
      borderRadius,
      colorTextLightSolid,
      colorBgSpotlight
    } = token;
    const TooltipToken = (0, _internal.mergeToken)(token, {
      // default variables
      tooltipMaxWidth: 250,
      tooltipColor: colorTextLightSolid,
      tooltipBorderRadius: borderRadius,
      tooltipBg: colorBgSpotlight
    });
    return [genTooltipStyle(TooltipToken), (0, _motion.initZoomMotion)(token, 'zoom-big-fast')];
  }, prepareComponentToken, {
    resetStyle: false,
    // Popover use Tooltip as internal component. We do not need to handle this.
    injectStyle
  });
  return useStyle(prefixCls, rootCls);
};
exports.default = _default;