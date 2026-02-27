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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { isArray, isBoolean } from '../utils';
/** new Chart options */
export var CHART_OPTIONS = ['renderer', 'plugins'];
/** There is only the view layer, no need to pass it down to children */
export var VIEW_OPTIONS = [
    'width',
    'height',
    'autoFit',
    'theme',
    'inset',
    'insetLeft',
    'insetRight',
    'insetTop',
    'insetBottom',
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'depth',
    'title',
    'clip',
    'children',
    'type',
    'data',
    'direction',
    'plugins',
];
/** 特殊标识，用于标识改配置来自于转换逻辑，而非用户配置 */
export var TRANSFORM_SIGN = '__transform__';
/** 特殊标识，用于跳过 删除已转换的配置项 */
export var SKIP_DEL_CUSTOM_SIGN = '__skipDelCustomKeys__';
/**
 * @title 字段转换逻辑
 * @example
 *    1. xField: 'year' -> encode: {x: 'year'}
 *    2. yField: 'scales' -> encode: {y: 'scales'}
 *    3. shape: 'smooth' -> style: {shape: 'smooth'} shapeField: 'shape' -> encode: { shape: 'shape' }
 *    4. connectNulls: {connect: true} -> style: {connect: true}
 *    5. keyField: 'key' -> encode: { key: 'key' }
 */
var commonCallback = function (type, value) {
    if (isBoolean(value)) {
        return {
            type: type,
            available: value,
        };
    }
    return __assign({ type: type }, value);
};
export var TRANSFORM_OPTION_KEY = {
    /** encode */
    xField: 'encode.x',
    yField: 'encode.y',
    colorField: 'encode.color',
    angleField: 'encode.y',
    keyField: 'encode.key',
    y1Field: 'encode.y1',
    sizeField: 'encode.size',
    setsField: 'encode.sets',
    shapeField: 'encode.shape',
    seriesField: 'encode.series',
    positionField: 'encode.position',
    textField: 'encode.text',
    valueField: 'encode.value',
    binField: 'encode.x',
    srcField: 'encode.src',
    linkColorField: 'encode.linkColor',
    fontSizeField: 'encode.fontSize',
    coordinateType: 'coordinate.type',
    radius: 'coordinate.outerRadius',
    innerRadius: 'coordinate.innerRadius',
    startAngle: 'coordinate.startAngle',
    endAngle: 'coordinate.endAngle',
    focusX: 'coordinate.focusX',
    focusY: 'coordinate.focusY',
    distortionX: 'coordinate.distortionX',
    distortionY: 'coordinate.distortionY',
    visual: 'coordinate.visual',
    /**
     * @title 堆叠
     * @example
     *  1. stack: true -> transform: [{type: 'stackY'}]
     */
    stack: {
        target: 'transform',
        value: function (value) {
            return commonCallback('stackY', value);
        },
    },
    /**
     * @title 归一化
     * @example
     *  1. normalize: true -> transform: [{type: 'normalizeY'}]
     */
    normalize: {
        target: 'transform',
        value: function (value) {
            return commonCallback('normalizeY', value);
        },
    },
    /**
     * @title 百分比
     * @description 同 normalize
     * @example
     *  1. percent: true -> transform: [{type: 'normalizeY'}]
     */
    percent: {
        target: 'transform',
        value: function (value) {
            return commonCallback('normalizeY', value);
        },
    },
    /**
     * @title 分组
     * @example
     *  1. group: true -> transform: [{type: 'dodgeX'}]
     */
    group: {
        target: 'transform',
        value: function (value) {
            return commonCallback('dodgeX', value);
        },
    },
    /**
     * @title 排序
     * @example
     *  1. sort: true -> transform: [{type: 'sortX'}]
     */
    sort: {
        target: 'transform',
        value: function (value) {
            return commonCallback('sortX', value);
        },
    },
    /**
     * @title 对称
     * @example
     *  1. symmetry: true -> transform: [{type: 'symmetryY'}]
     */
    symmetry: {
        target: 'transform',
        value: function (value) {
            return commonCallback('symmetryY', value);
        },
    },
    /**
     * @title 对 y 和 y1 通道求差集
     * @example
     *  1. diff: true -> transform: [{type: 'diffY'}]
     */
    diff: {
        target: 'transform',
        value: function (value) {
            return commonCallback('diffY', value);
        },
    },
    meta: {
        target: 'scale',
        value: function (value) {
            return value;
        },
    },
    label: {
        target: 'labels',
        value: function (value) {
            return value;
        },
    },
    /**
     * @title 折线的形状
     * @example
     *  1. shape: 'smooth' -> style: {shape: 'smooth'}
     */
    shape: 'style.shape',
    /**
     * @title 是否链接空值
     * @description 支持 boolean 和 对象类型
     */
    connectNulls: {
        target: 'style',
        value: function (value) {
            if (isBoolean(value)) {
                return {
                    connect: value,
                };
            }
            return value;
        },
    },
    /**
     * @title 坐标转换
     * @example
     *  1. transpose: true -> coordinate: { transform: [{ type: 'transpose' }]}
     *  2. transpose: false -> coordinate: { }
     */
    transpose: {
        target: 'transpose',
        value: function (value) {
            return commonCallback('transpose', value);
        },
    },
};
/**
 * @title 将 CONFIG_SHAPE 中的配置项, 转换为 children
 * @example
 *    1. annotations: [{type: 'text'}] -> children: [{type: 'text'}]
 *    2. line: {shape: 'hvh'}-> children: [{type: 'line', style: { shape: 'hvh'}}]
 */
var EXTENDED_PROPERTIES = [
    'xField',
    'yField',
    'seriesField',
    'colorField',
    'shapeField',
    'keyField',
    'positionField',
    'meta',
    'tooltip',
    'animate',
    'stack',
    'normalize',
    'percent',
    'group',
    'sort',
    'symmetry',
    'diff',
];
export var CONFIG_SHAPE = [
    {
        key: 'annotations',
        extendedProperties: [],
    },
    {
        key: 'line',
        type: 'line',
        extendedProperties: EXTENDED_PROPERTIES,
    },
    {
        key: 'connector',
        type: 'connector',
        extendedProperties: [],
    },
    {
        key: 'point',
        type: 'point',
        extendedProperties: EXTENDED_PROPERTIES,
        defaultShapeConfig: {
            shapeField: 'circle',
        },
    },
    {
        key: 'area',
        type: 'area',
        extendedProperties: EXTENDED_PROPERTIES,
    },
];
/**
 * @description 一些特殊的配置项，需要自定义转换逻辑
 */
export var SPECIAL_OPTIONS = [
    {
        key: 'transform',
        callback: function (origin, key, value) {
            var _a;
            origin[key] = origin[key] || [];
            var _b = value.available, available = _b === void 0 ? true : _b, rest = __rest(value, ["available"]);
            if (available) {
                origin[key].push(__assign((_a = {}, _a[TRANSFORM_SIGN] = true, _a), rest));
            }
            else {
                var index = origin[key].indexOf(function (item) { return item.type === value.type; });
                if (index !== -1) {
                    origin[key].splice(index, 1);
                }
            }
        },
    },
    {
        key: 'labels',
        callback: function (origin, key, value) {
            var _a;
            /**
             * @description 特殊情况处理
             *   1. 如果 labels 为 false，表示关闭标签
             *   2. 如果 labels 为数组，用于多 label 的场景
             * @example
             *   1. label: false -> labels: []
             *   2. label: [{x}, {xx}] -> labels: [{x}, {xx}]
             */
            if (!value || isArray(value)) {
                origin[key] = value ? value : [];
                return;
            }
            /**
             * @description 填充默认 text 逻辑
             */
            if (!value.text) {
                value['text'] = origin['yField'];
            }
            origin[key] = origin[key] || [];
            origin[key].push(__assign((_a = {}, _a[TRANSFORM_SIGN] = true, _a), value));
        },
    },
    {
        key: 'transpose',
        callback: function (origin, key, value) {
            var _a;
            if (value.available) {
                origin['coordinate'] = {
                    transform: [__assign((_a = {}, _a[TRANSFORM_SIGN] = true, _a), value)],
                };
            }
            else {
                origin['coordinate'] = {};
            }
        },
    },
];
export var ANNOTATION_LIST = [
    {
        key: 'conversionTag',
        shape: 'ConversionTag',
    },
    {
        key: 'axisText',
        shape: 'BidirectionalBarAxisText',
    },
];
