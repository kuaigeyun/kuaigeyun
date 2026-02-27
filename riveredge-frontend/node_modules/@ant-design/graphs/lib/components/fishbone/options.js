"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
exports.getFishboneOptions = getFishboneOptions;
const lodash_1 = require("lodash");
const label_1 = require("../../core/utils/label");
const measure_text_1 = require("../../core/utils/measure-text");
exports.DEFAULT_OPTIONS = {
    node: {
        style: {
            size: 10,
            labelPlacement: 'center',
        },
    },
    edge: {
        type: 'polyline',
    },
    layout: {
        type: 'fishbone',
        hGap: 40,
        vGap: 60,
    },
    animation: false,
};
const FONT_FAMILY = 'system-ui, sans-serif';
const getNodeSize = (id, depth) => {
    if (depth === 0)
        return (0, measure_text_1.measureTextSize)(id, [80, 48], { fontSize: 24, fontWeight: 600, fontFamily: FONT_FAMILY });
    if (depth === 1)
        return (0, measure_text_1.measureTextSize)(id, [80, 30], { fontSize: 18, fontFamily: FONT_FAMILY });
    return [2, 30];
};
const getNodeFill = (node) => {
    const depth = node.depth;
    if (depth === 0)
        return '#EFF0F0';
    if (depth === 1)
        return node.style?.color || '#EFF0F0';
    return 'transparent';
};
function getFishboneOptions({ type, labelField }) {
    const options = {
        node: {
            type: 'rect',
            style: {
                fill: (d) => getNodeFill(d),
                labelFill: (d) => (d.depth === 1 ? '#fff' : '#262626'),
                labelFillOpacity: 1,
                labelFontSize: (d) => (d.depth === 0 ? 24 : d.depth === 1 ? 18 : 16),
                labelFontWeight: (d) => (d.depth === 0 ? 600 : 400),
                labelLineHeight: (d) => (d.depth === 0 ? 26 : d.depth === 1 ? 20 : 18),
                labelText: (d) => (0, label_1.formatLabel)(d, labelField),
                radius: 8,
                size: (d) => getNodeSize(d.id, d.depth),
            },
        },
        edge: {
            type: 'polyline',
            style: {
                lineWidth: 3,
                stroke: function (data) {
                    const target = this.getNodeData(data.target);
                    return (0, lodash_1.get)(target, 'style.color', '#99ADD1');
                },
            },
        },
        transforms: (prev) => [
            ...prev,
            {
                type: 'assign-color-by-branch',
                key: 'assign-color-by-branch',
            },
            {
                type: 'arrange-edge-z-index',
                key: 'arrange-edge-z-index',
            },
        ],
    };
    options.layout ||= {};
    if (type === 'decision') {
        // @ts-ignore
        options.node.style.labelPlacement = (d) => (d.depth === 0 || d.depth === 1 ? 'center' : 'right');
        Object.assign(options.layout, { direction: 'LR' });
    }
    else if (type === 'cause') {
        // @ts-ignore
        options.node.style.labelPlacement = (d) => (d.depth === 0 || d.depth === 1 ? 'center' : 'left');
        Object.assign(options.layout, { direction: 'RL' });
    }
    return options;
}
