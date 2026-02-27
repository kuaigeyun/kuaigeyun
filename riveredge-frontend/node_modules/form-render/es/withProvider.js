import "antd/es/config-provider/style";
import _ConfigProvider from "antd/es/config-provider";
import { __rest } from "tslib";
import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useUnmount } from 'ahooks';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import locales from './locales';
import 'dayjs/locale/zh-cn';
import { createStore } from './models/store';
import { FRContext, ConfigContext } from './models/context';
import { validateMessagesEN, validateMessagesCN } from './models/validateMessage';
export default function withProvider(Element, defaultWidgets) {
  return function (props) {
    var configProvider = props.configProvider,
      _props$locale = props.locale,
      locale = _props$locale === void 0 ? 'zh-CN' : _props$locale,
      widgets = props.widgets,
      methods = props.methods,
      form = props.form,
      validateMessages = props.validateMessages,
      _props$globalProps = props.globalProps,
      globalProps = _props$globalProps === void 0 ? {} : _props$globalProps,
      _props$globalConfig = props.globalConfig,
      globalConfig = _props$globalConfig === void 0 ? {} : _props$globalConfig,
      otherProps = __rest(props, ["configProvider", "locale", "widgets", "methods", "form", "validateMessages", "globalProps", "globalConfig"]);
    var storeRef = useRef(createStore());
    var store = storeRef.current;
    useEffect(function () {
      if (locale === 'en-US') {
        dayjs.locale('en');
        return;
      }
      dayjs.locale('zh-cn');
    }, [locale]);
    useUnmount(function () {
      form.resetFields();
    });
    if (!form) {
      console.warn('Please provide a form instance to FormRender');
      return null;
    }
    var antdLocale = locale === 'zh-CN' ? zhCN : enUS;
    var formValidateMessages = locale === 'zh-CN' ? validateMessagesCN : validateMessagesEN;
    var configContext = {
      locale: locale,
      widgets: Object.assign(Object.assign({}, defaultWidgets), widgets),
      methods: methods,
      form: form,
      globalProps: globalProps,
      globalConfig: globalConfig
    };
    var langPack = Object.assign(Object.assign(Object.assign({}, antdLocale), {
      'FormRender': locales[locale]
    }), configProvider === null || configProvider === void 0 ? void 0 : configProvider.locale);
    return /*#__PURE__*/React.createElement(_ConfigProvider, Object.assign({}, configProvider, {
      locale: langPack,
      form: {
        validateMessages: Object.assign(Object.assign({}, formValidateMessages), validateMessages)
      }
    }), /*#__PURE__*/React.createElement(ConfigContext.Provider, {
      value: configContext
    }, /*#__PURE__*/React.createElement(FRContext.Provider, {
      value: store
    }, /*#__PURE__*/React.createElement(Element, Object.assign({
      form: form
    }, otherProps)))));
  };
}