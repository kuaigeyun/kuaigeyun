import { get } from 'lodash';
import React from 'react';
import { CollapseExpandIcon, RCNode } from '../../core/base';
import { formatLabel } from '../../core/utils/label';
import { measureTextSize } from '../../core/utils/measure-text';
import { getNodeSide } from '../../core/utils/node';
import { getBoxedTextNodeStyle, getLinearTextNodeStyle } from '../../core/utils/tree';
const { ArrowCountIcon } = CollapseExpandIcon;
const { TextNode } = RCNode;
export const DEFAULT_OPTIONS = {
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
                return React.createElement(ArrowCountIcon, { graph: this, data: data, isCollapsed: isCollapsed });
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
    const side = getNodeSide(graph, data);
    return side === 'left' ? 'right' : side === 'center' ? 'center' : 'left';
};
export const getIndentedTreeOptions = ({ type, nodeMinWidth, nodeMaxWidth, direction, labelField, }) => {
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
                        const label = formatLabel(data, labelField);
                        const { font } = getBoxedTextNodeStyle(label, minWidth, maxWidth, depth);
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
                        return React.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = formatLabel(data, labelField);
                        return getBoxedTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                    },
                },
            },
            edge: {
                style: {
                    stroke: function (data) {
                        const source = this.getNodeData(data.source);
                        return get(source, 'style.color', '#99ADD1');
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
                    const label = formatLabel(data, labelField);
                    const [width] = getBoxedTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                    return width;
                },
                getHeight: (data) => {
                    const label = formatLabel(data, labelField);
                    const [, height] = getBoxedTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
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
                        const label = formatLabel(data, labelField);
                        const { font } = getLinearTextNodeStyle(label, minWidth, maxWidth, depth);
                        const props = { text: label, color, maxWidth, font };
                        Object.assign(props, depth === 0
                            ? { type: 'filled', color: '#f1f4f5', style: { color: '#252525' } }
                            : {
                                type: 'underlined',
                                style: { textAlign: getNodeTextAlign(this, data) },
                            });
                        return React.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = formatLabel(data, labelField);
                        return getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                    },
                    ports: function (data) {
                        const side = getNodeSide(this, data);
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
                        return get(target, 'style.color', '#99ADD1');
                    },
                    radius: 24,
                },
            },
            layout: {
                type: 'indented',
                getWidth: (data) => {
                    const label = formatLabel(data, labelField);
                    const [width] = getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                    return width;
                },
                getHeight: (data) => {
                    const label = formatLabel(data, labelField);
                    const [, height] = getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
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
                        const label = formatLabel(data, labelField);
                        return React.createElement(TextNode, { type: "filled", text: label });
                    },
                    size: (data) => {
                        const label = formatLabel(data, labelField);
                        return measureTextSize(label, PADDING);
                    },
                },
            },
            layout: {
                type: 'indented',
                getWidth: (data) => {
                    const label = formatLabel(data, labelField);
                    const [width] = measureTextSize(label, PADDING);
                    return width;
                },
                getHeight: (data) => {
                    const label = formatLabel(data, labelField);
                    const [, height] = measureTextSize(label, PADDING);
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
