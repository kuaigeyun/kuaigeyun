"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOptions = void 0;
var constants_1 = require("../constants");
var index_1 = require("./index");
/**
 * @title 将自定义配置转换为 G2 接受的格式
 */
var transformOptions = function (params) {
    var options = (0, index_1.filterTransformed)(params);
    var _a = options.children, children = _a === void 0 ? [] : _a;
    var rest = (0, index_1.omit)(options, [].concat(constants_1.VIEW_OPTIONS, constants_1.CONFIG_SHAPE.map(function (item) { return item.key; })));
    var getCustomTransform = function (key) {
        var _a;
        return (_a = constants_1.SPECIAL_OPTIONS.find(function (option) { return option.key === key; })) === null || _a === void 0 ? void 0 : _a.callback;
    };
    /**
     * @description 更新图表配置
     */
    var updateOptions = function (origin, key, value) {
        var callback = getCustomTransform(key);
        if (callback) {
            callback(origin, key, value);
        }
        else {
            origin[key] = (0, index_1.mergeWithArrayCoverage)({}, origin[key], value);
        }
    };
    /**
     * @description
     *  1. 将 CONFIG_SHAPE 中的配置项, 转换为 children
     * @example 详见 src/core/constants/index.ts
     */
    var transformShape = function (config) {
        Object.keys(config).forEach(function (key) {
            // 判断内容是否为空
            if (!config[key])
                return;
            var exist = constants_1.CONFIG_SHAPE.find(function (item) { return item.key === key; });
            if (exist) {
                var type = exist.type, extendedProperties = exist.extendedProperties, _a = exist.defaultShapeConfig, defaultShapeConfig = _a === void 0 ? {} : _a;
                if (type) {
                    var tooltip = config[key].tooltip;
                    children.push(transformConfig((0, index_1.mergeWithArrayCoverage)({}, (0, index_1.pick)(config, extendedProperties), defaultShapeConfig, { type: type }, config[key], {
                        tooltip: tooltip ? tooltip : false,
                    })));
                }
                else {
                    // annotations
                    if ((0, index_1.isArray)(config[key])) {
                        var isText_1 = config[key].some(function (item) { return item.type === 'text'; });
                        config[key].forEach(function (annotation) {
                            children.push(transformConfig(__assign(__assign(__assign({}, (isText_1 ? { data: [] } : {})), { tooltip: false }), annotation)));
                        });
                    }
                }
            }
        });
    };
    /**
     * @title 通用转换逻辑
     * @description 直接修改原对象
     */
    var transformConfig = function (config) {
        transformShape(config);
        /**
         * @description 遍历配置项，如果存在对应的映射规则，则进行转换
         * @example 详见 src/core/constants/index.ts
         */
        Object.keys(constants_1.TRANSFORM_OPTION_KEY).forEach(function (key) {
            var transformTarget = constants_1.TRANSFORM_OPTION_KEY[key];
            if (!(0, index_1.isUndefined)(config[key])) {
                if ((0, index_1.isObject)(transformTarget)) {
                    var value = transformTarget.value, target = transformTarget.target;
                    var transformValue = value(config[key]);
                    updateOptions(config, target, transformValue);
                }
                else {
                    (0, index_1.set)(config, transformTarget, config[key]);
                }
            }
        });
        return config;
    };
    children.forEach(function (child) {
        /**
         * 提前先 child 创造一个 config 防止 rest 被污染 和 child 数据缺失
         * @description 外层配置应用到所有 children
         */
        var config = (0, index_1.mergeWithArrayCoverage)({}, rest, child);
        transformConfig((0, index_1.mergeWithArrayCoverage)(child, config));
    });
    transformShape(options);
    (0, index_1.deleteExcessKeys)(options);
    return params;
};
exports.transformOptions = transformOptions;
