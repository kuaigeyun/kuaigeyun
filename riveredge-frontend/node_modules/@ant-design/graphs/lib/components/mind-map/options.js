"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
exports.getMindMapOptions = getMindMapOptions;
const lodash_1 = require("lodash");
const react_1 = __importDefault(require("react"));
const base_1 = require("../../core/base");
const label_1 = require("../../core/utils/label");
const measure_text_1 = require("../../core/utils/measure-text");
const node_1 = require("../../core/utils/node");
const tree_1 = require("../../core/utils/tree");
const { ArrowCountIcon } = base_1.CollapseExpandIcon;
const { TextNode } = base_1.RCNode;
exports.DEFAULT_OPTIONS = {
    node: {
        type: 'react',
        state: {
            active: {
                halo: false,
            },
            selected: {
                halo: false,
            },
        },
    },
    edge: {
        type: 'cubic-horizontal',
        style: {
            lineWidth: 3,
        },
    },
    transforms: (prev) => [
        ...prev,
        {
            type: 'collapse-expand-react-node',
            key: 'collapse-expand-react-node',
            enable: false,
            trigger: 'icon',
            iconRender: function (isCollapsed, data) {
                const side = (0, node_1.getNodeSide)(this, data);
                return (react_1.default.createElement(ArrowCountIcon, { graph: this, data: data, isCollapsed: isCollapsed, placement: side === 'left' ? 'left' : 'right' }));
            },
            iconPlacement: function (data) {
                const side = (0, node_1.getNodeSide)(this, data);
                return side === 'left' ? 'left' : 'right';
            },
        },
    ],
    layout: {
        type: 'mindmap',
        direction: 'H',
        preLayout: false,
        getWidth: () => 120,
        getHGap: () => 64,
    },
    animation: {
        duration: 500,
    },
};
function getMindMapOptions({ type, direction, nodeMinWidth, nodeMaxWidth, labelField, }) {
    let options = {};
    if (type === 'boxed') {
        const minWidth = nodeMinWidth || 120;
        const maxWidth = nodeMaxWidth || 300;
        options = {
            node: {
                style: {
                    component: (data) => {
                        const depth = data.depth;
                        const color = data.style?.color;
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const { font } = (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, depth);
                        const props = { text: label, color, maxWidth, font };
                        Object.assign(props, depth === 0
                            ? { type: 'filled', color: '#f1f4f5', style: { color: '#252525' } }
                            : depth === 1
                                ? { type: 'filled' }
                                : { type: 'outlined' });
                        return react_1.default.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = (0, label_1.formatLabel)(data, labelField);
                        return (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    },
                    dx: function (data) {
                        const side = (0, node_1.getNodeSide)(this, data);
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const [width] = (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                        return side === 'left' ? -width : side === 'center' ? -width / 2 : 0;
                    },
                    ports: [{ placement: 'left' }, { placement: 'right' }],
                },
            },
            edge: {
                style: {
                    stroke: function (data) {
                        const source = this.getNodeData(data.source);
                        return (0, lodash_1.get)(source, 'style.color', '#99ADD1');
                    },
                },
            },
            transforms: (prev) => [...prev, { type: 'assign-color-by-branch', key: 'assign-color-by-branch' }],
            layout: {
                type: 'mindmap',
                getHeight: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [, height] = (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    return height;
                },
                getVGap: () => 14,
            },
        };
    }
    else if (type === 'linear') {
        const minWidth = nodeMinWidth || 0;
        const maxWidth = nodeMaxWidth || 300;
        options = {
            node: {
                style: {
                    component: function (data) {
                        const side = (0, node_1.getNodeSide)(this, data);
                        const depth = data.depth;
                        const color = data.style?.color;
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const { font } = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, depth);
                        const props = { text: label, color, maxWidth, font };
                        Object.assign(props, depth === 0
                            ? { type: 'filled', color: '#f1f4f5', style: { color: '#252525' } }
                            : {
                                type: 'underlined',
                                style: side === 'left' ? { textAlign: 'right' } : side === 'center' ? { textAlign: 'center' } : {},
                            });
                        return react_1.default.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = (0, label_1.formatLabel)(data, labelField);
                        return (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    },
                    dx: function (data) {
                        const side = (0, node_1.getNodeSide)(this, data);
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const [width] = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                        return side === 'left' ? -width : side === 'center' ? -width / 2 : 0;
                    },
                    dy: function (data) {
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const [, height] = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                        return height / 2;
                    },
                    ports: function (data) {
                        const side = (0, node_1.getNodeSide)(this, data);
                        return side === 'center'
                            ? [{ placement: 'left' }, { placement: 'right' }]
                            : [{ placement: 'left-bottom' }, { placement: 'right-bottom' }];
                    },
                },
            },
            edge: {
                style: {
                    stroke: function (data) {
                        const target = this.getNodeData(data.target);
                        return (0, lodash_1.get)(target, 'style.color', '#99ADD1');
                    },
                },
            },
            layout: {
                type: 'mindmap',
                getHeight: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [, height] = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    return height;
                },
                getVGap: () => 12,
            },
            transforms: (prev) => [
                ...prev.filter((t) => t.key !== 'collapse-expand-react-node'),
                {
                    type: 'assign-color-by-branch',
                    key: 'assign-color-by-branch',
                },
                {
                    ...prev.find((t) => t.key === 'collapse-expand-react-node'),
                    iconOffsetY: (data) => {
                        if (data.depth === 0)
                            return 0;
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const [, height] = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                        return height / 2;
                    },
                },
            ],
        };
    }
    else {
        const PADDING = [24, 16];
        options = {
            node: {
                style: {
                    component: (data) => {
                        const label = (0, label_1.formatLabel)(data, labelField);
                        return react_1.default.createElement(TextNode, { type: "filled", text: label });
                    },
                    size: (data) => {
                        const label = (0, label_1.formatLabel)(data, labelField);
                        return (0, measure_text_1.measureTextSize)(label, PADDING);
                    },
                    dx: function (data) {
                        const side = (0, node_1.getNodeSide)(this, data);
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const [width] = (0, measure_text_1.measureTextSize)(label, PADDING);
                        return side === 'left' ? -width : side === 'center' ? -width / 2 : 0;
                    },
                    ports: [{ placement: 'left' }, { placement: 'right' }],
                },
            },
            layout: {
                type: 'mindmap',
                getHeight: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [, height] = (0, measure_text_1.measureTextSize)(label, PADDING);
                    return height;
                },
            },
        };
    }
    if (direction) {
        options.layout ||= {};
        options.layout.direction =
            direction === 'alternate' ? 'H' : direction === 'left' ? 'RL' : 'LR';
    }
    return options;
}
