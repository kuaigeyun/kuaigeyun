"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plot = void 0;
var event_emitter_1 = __importDefault(require("@antv/event-emitter"));
var g2_1 = require("@antv/g2");
var chart_1 = require("./chart");
var annotation_1 = require("../annotation");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var SOURCE_ATTRIBUTE_NAME = 'data-chart-source-type';
var Plot = /** @class */ (function (_super) {
    __extends(Plot, _super);
    function Plot(container, options) {
        var _this = _super.call(this) || this;
        // 新增：用于跟踪事件监听器和清理资源
        _this.eventListeners = [];
        _this.bindedEvents = false;
        _this.container = typeof container === 'string' ? document.getElementById(container) : container;
        _this.options = _this.mergeOption(options);
        _this.createG2();
        _this.bindEvents();
        return _this;
    }
    /**
     * new Chart 所需配置
     */
    Plot.prototype.getChartOptions = function () {
        return __assign(__assign({}, (0, utils_1.pick)(this.options, constants_1.CHART_OPTIONS)), { container: this.container });
    };
    /**
     * G2 options(Spec) 配置
     */
    Plot.prototype.getSpecOptions = function () {
        if (this.type === 'base' || this[constants_1.SKIP_DEL_CUSTOM_SIGN]) {
            return __assign(__assign({}, this.options), this.getChartOptions());
        }
        return this.options;
    };
    /**
     * 创建 G2 实例
     */
    Plot.prototype.createG2 = function () {
        if (!this.container) {
            throw Error('The container is not initialized!');
        }
        this.chart = new chart_1.Chart(this.getChartOptions());
        // 给容器增加标识，知道图表的来源区别于 G2
        this.container.setAttribute(SOURCE_ATTRIBUTE_NAME, 'Ant Design Charts');
    };
    /**
     * 绑定代理所有 G2 的事件
     */
    Plot.prototype.bindEvents = function () {
        var _this = this;
        if (this.chart) {
            var eventHandler_1 = function (e) {
                if (e === null || e === void 0 ? void 0 : e.type) {
                    _this.emit(e.type, e);
                }
            };
            this.chart.on('*', eventHandler_1);
            this.eventListeners.push(function () {
                var _a;
                (_a = _this.chart) === null || _a === void 0 ? void 0 : _a.off('*', eventHandler_1);
            });
        }
    };
    Plot.prototype.getBaseOptions = function () {
        return { type: 'view', autoFit: true };
    };
    /**
     * 获取默认的 options 配置项，每个组件都可以复写
     */
    Plot.prototype.getDefaultOptions = function () { };
    /**
     * 绘制
     */
    Plot.prototype.render = function () {
        var _this = this;
        // 执行 adaptor , base 穿透类型不必 adaptor.
        if (this.type !== 'base') {
            this.execAdaptor();
        }
        // options 转换
        this.chart.options(this.getSpecOptions());
        // 渲染
        this.chart.render().then(function () {
            if (_this.annotation) {
                _this.annotation.update();
            }
            else {
                _this.annotation = new annotation_1.Controller(_this.chart, _this.options);
            }
            _this.bindSizeSensor();
        });
    };
    /**
     * 更新
     * @param options
     */
    Plot.prototype.update = function (options) {
        this.options = this.mergeOption(options);
    };
    Plot.prototype.mergeOption = function (options) {
        return (0, utils_1.mergeWithArrayCoverage)({}, this.getBaseOptions(), this.getDefaultOptions(), options);
    };
    /**
     * 更新数据
     * @override
     * @param options
     */
    Plot.prototype.changeData = function (data) {
        this.chart.changeData(data);
    };
    /**
     * 修改画布大小
     * @param width
     * @param height
     */
    Plot.prototype.changeSize = function (width, height) {
        this.chart.changeSize(width, height);
    };
    /**
     * 销毁
     */
    Plot.prototype.destroy = function () {
        // 清理所有事件监听器
        this.eventListeners.forEach(function (cleanup) { return cleanup(); });
        this.eventListeners = [];
        // 清理 annotation
        if (this.annotation && typeof this.annotation.destroy === 'function') {
            this.annotation.destroy();
        }
        this.annotation = null;
        // G2 的销毁
        this.chart.destroy();
        // 清空已经绑定的事件
        this.off();
        this.bindedEvents = false;
        this.container.removeAttribute(SOURCE_ATTRIBUTE_NAME);
    };
    /**
     * 执行 adaptor 操作
     */
    Plot.prototype.execAdaptor = function () {
        var adaptor = this.getSchemaAdaptor();
        // 转化成 G2 Spec
        adaptor({
            chart: this.chart,
            options: this.options,
        });
    };
    /**
     * 当图表容器大小变化的时候，执行的函数
     */
    Plot.prototype.triggerResize = function () {
        this.chart.forceFit();
    };
    /**
     * 绑定 dom 容器大小变化的事件
     */
    Plot.prototype.bindSizeSensor = function () {
        var _this = this;
        if (this.bindedEvents)
            return;
        var _a = this.options.autoFit, autoFit = _a === void 0 ? true : _a;
        if (autoFit) {
            var resizeHandler_1 = function () {
                if (_this.annotation) {
                    _this.annotation.update();
                }
            };
            this.chart.on(g2_1.ChartEvent.AFTER_CHANGE_SIZE, resizeHandler_1);
            // 记录清理函数
            this.eventListeners.push(function () {
                var _a;
                (_a = _this.chart) === null || _a === void 0 ? void 0 : _a.off(g2_1.ChartEvent.AFTER_CHANGE_SIZE, resizeHandler_1);
            });
            this.bindedEvents = true;
        }
    };
    return Plot;
}(event_emitter_1.default));
exports.Plot = Plot;
