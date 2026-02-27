import { resetComponent, textEllipsis } from '../../style';
import { genStyleHooks, mergeToken } from '../../theme/internal';
import genHorizontalStyle from './horizontal';
import genIconStyle from './icon';
import genInlineStyle from './inline';
import genLabelPlacementStyle from './label-placement';
import genLegacyNavStyle from './nav';
import genPanelStyle from './panel';
import genStepsProgressStyle from './progress';
import genDotStyle from './progress-dot';
import genRTLStyle from './rtl';
import genSmallStyle from './small';
import genStatusStyle from './status';
import genVerticalStyle from './vertical';
const genBasicStyle = token => {
  const {
    componentCls
  } = token;
  const itemCls = `${componentCls}-item`;
  return {
    [componentCls]: {
      // TODO: use `genCssVar` hook to generate css variables
      '--steps-title-font-size': token.fontSizeLG,
      '--steps-title-line-height': token.lineHeightLG,
      '--steps-subtitle-font-size': token.fontSize,
      '--steps-subtitle-line-height': token.lineHeight,
      '--steps-item-wrapper-padding-top': '0px',
      '--steps-rail-size': token.lineWidth,
      '--steps-rail-line-style': token.lineType,
      ...resetComponent(token),
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'flex-start',
      [itemCls]: {
        flex: 'none',
        position: 'relative'
      },
      [`${itemCls}-wrapper`]: {
        display: 'flex',
        flexWrap: 'nowrap',
        paddingTop: `var(--steps-item-wrapper-padding-top)`
      },
      // Icon
      // Check `./icon.ts`
      // Header
      [`${itemCls}-header`]: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center'
      },
      // >>> Title
      [`${itemCls}-title`]: {
        color: token.colorText,
        fontSize: `var(--steps-title-font-size)`,
        lineHeight: `var(--steps-title-line-height)`,
        wordBreak: 'break-word'
      },
      // >>> Sub Title
      [`${itemCls}-subtitle`]: {
        color: token.colorTextDescription,
        fontWeight: 'normal',
        fontSize: `var(--steps-subtitle-font-size)`,
        lineHeight: `var(--steps-subtitle-line-height)`,
        marginInlineStart: token.marginXS,
        wordBreak: 'break-word'
      },
      // Content
      [`${itemCls}-content`]: {
        color: token.colorTextDescription,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        wordBreak: 'break-word'
      },
      // Rail
      [`${itemCls}-rail`]: {
        borderStyle: 'var(--steps-rail-line-style)',
        borderWidth: 0
      },
      // Motion
      [`${itemCls}-title, ${itemCls}-subtitle, ${itemCls}-content, ${itemCls}-rail`]: {
        transition: `all ${token.motionDurationSlow}`
      },
      // ========================== Ellipsis ==========================
      [`&${componentCls}-ellipsis`]: {
        [`${itemCls}-title, ${itemCls}-subtitle, ${itemCls}-content`]: textEllipsis
      },
      // ========================= Clickable ==========================
      [`${itemCls}[role='button']:not(${itemCls}-active):hover`]: {
        cursor: 'pointer'
      }
    }
  };
};
// ============================== Export ==============================
export const prepareComponentToken = token => ({
  titleLineHeight: token.controlHeight,
  customIconSize: token.controlHeight,
  customIconTop: 0,
  customIconFontSize: token.controlHeightSM,
  iconSize: token.controlHeight,
  iconTop: -0.5,
  // magic for ui experience
  iconFontSize: token.fontSize,
  iconSizeSM: token.fontSizeHeading3,
  dotSize: token.controlHeight / 4,
  dotCurrentSize: token.controlHeightLG / 4,
  navArrowColor: token.colorTextDisabled,
  navContentMaxWidth: 'unset',
  descriptionMaxWidth: undefined,
  // should be `undefined` to create css var
  waitIconColor: token.wireframe ? token.colorTextDisabled : token.colorTextLabel,
  waitIconBgColor: token.wireframe ? token.colorBgContainer : token.colorFillContent,
  waitIconBorderColor: token.wireframe ? token.colorTextDisabled : 'transparent',
  finishIconBgColor: token.wireframe ? token.colorBgContainer : token.controlItemBgActive,
  finishIconBorderColor: token.wireframe ? token.colorPrimary : token.controlItemBgActive
});
export default genStyleHooks('Steps', token => {
  const stepsToken = mergeToken(token, {
    inlineDotSize: 6
  });
  return [genBasicStyle(stepsToken), genIconStyle(stepsToken), genVerticalStyle(stepsToken), genHorizontalStyle(stepsToken), genLabelPlacementStyle(stepsToken), genSmallStyle(stepsToken), genDotStyle(stepsToken), genStatusStyle(stepsToken), genLegacyNavStyle(stepsToken), genPanelStyle(stepsToken), genInlineStyle(stepsToken), genStepsProgressStyle(stepsToken), genRTLStyle(stepsToken)];
}, prepareComponentToken);