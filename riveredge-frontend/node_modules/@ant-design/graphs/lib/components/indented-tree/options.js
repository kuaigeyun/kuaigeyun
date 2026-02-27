"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndentedTreeOptions = exports.DEFAULT_OPTIONS = void 0;
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
        type: 'indented',
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
                return react_1.default.createElement(ArrowCountIcon, { graph: this, data: data, isCollapsed: isCollapsed });
            },
        },
    ],
    layout: {
        type: 'indented',
        direction: 'LR',
        indent: (node) => getIndent(node, 20),
        getVGap: () => 14,
        preLayout: false,
    },
    animation: {
        duration: 500,
    },
};
const getIndent = (node, preset) => {
    if (node.depth === 0)
        return 0;
    let totalWidth = preset;
    let currentNode = node.parent;
    while (currentNode) {
        totalWidth += currentNode.width / 2;
        currentNode = currentNode.parent;
    }
    return totalWidth / node.depth;
};
const getNodeTextAlign = (graph, data) => {
    const side = (0, node_1.getNodeSide)(graph, data);
    return side === 'left' ? 'right' : side === 'center' ? 'center' : 'left';
};
const getIndentedTreeOptions = ({ type, nodeMinWidth, nodeMaxWidth, direction, labelField, }) => {
    let options = {};
    const minWidth = nodeMinWidth || 0;
    const maxWidth = nodeMaxWidth || 300;
    if (type === 'boxed') {
        options = {
            node: {
                style: {
                    component: function (data) {
                        const depth = data.depth;
                        const color = data.style?.color;
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const { font } = (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, depth);
                        const props = {
                            type: depth === 0 || depth === 1 ? 'filled' : 'outlined',
                            text: label,
                            color: depth === 0 ? '#f1f4f5' : color,
                            maxWidth,
                            font,
                            style: {
                                textAlign: getNodeTextAlign(this, data),
                                ...(depth === 0 ? { color: '#252525' } : {}),
                            },
                        };
                        return react_1.default.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = (0, label_1.formatLabel)(data, labelField);
                        return (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    },
                },
            },
            edge: {
                style: {
                    stroke: function (data) {
                        const source = this.getNodeData(data.source);
                        return (0, lodash_1.get)(source, 'style.color', '#99ADD1');
                    },
                    radius: 16,
                },
            },
            transforms: (prev) => [
                ...prev,
                {
                    type: 'assign-color-by-branch',
                    key: 'assign-color-by-branch',
                },
            ],
            layout: {
                type: 'indented',
                getWidth: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [width] = (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    return width;
                },
                getHeight: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [, height] = (0, tree_1.getBoxedTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    return height;
                },
            },
        };
    }
    else if (type === 'linear') {
        options = {
            node: {
                style: {
                    component: function (data) {
                        const depth = data.depth;
                        const color = data.style?.color;
                        const label = (0, label_1.formatLabel)(data, labelField);
                        const { font } = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, depth);
                        const props = { text: label, color, maxWidth, font };
                        Object.assign(props, depth === 0
                            ? { type: 'filled', color: '#f1f4f5', style: { color: '#252525' } }
                            : {
                                type: 'underlined',
                                style: { textAlign: getNodeTextAlign(this, data) },
                            });
                        return react_1.default.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = (0, label_1.formatLabel)(data, labelField);
                        return (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    },
                    ports: function (data) {
                        const side = (0, node_1.getNodeSide)(this, data);
                        return side === 'left'
                            ? [{ placement: 'bottom' }, { placement: 'bottom-right' }]
                            : side === 'center'
                                ? [{ placement: 'bottom' }]
                                : [{ placement: 'bottom' }, { placement: 'bottom-left' }];
                    },
                },
            },
            edge: {
                style: {
                    stroke: function (data) {
                        const target = this.getNodeData(data.target);
                        return (0, lodash_1.get)(target, 'style.color', '#99ADD1');
                    },
                    radius: 24,
                },
            },
            layout: {
                type: 'indented',
                getWidth: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [width] = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    return width;
                },
                getHeight: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [, height] = (0, tree_1.getLinearTextNodeStyle)(label, minWidth, maxWidth, data.depth).size;
                    return height;
                },
                getVGap: () => 12,
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
                },
            },
            layout: {
                type: 'indented',
                getWidth: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    const [width] = (0, measure_text_1.measureTextSize)(label, PADDING);
                    return width;
                },
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
        Object.assign(options.layout, {
            direction: direction === 'alternate' ? 'H' : direction === 'left' ? 'RL' : 'LR',
        });
    }
    return options;
};
exports.getIndentedTreeOptions = getIndentedTreeOptions;
