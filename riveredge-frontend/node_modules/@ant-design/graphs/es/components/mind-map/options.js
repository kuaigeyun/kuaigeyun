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
                const side = getNodeSide(this, data);
                return (React.createElement(ArrowCountIcon, { graph: this, data: data, isCollapsed: isCollapsed, placement: side === 'left' ? 'left' : 'right' }));
            },
            iconPlacement: function (data) {
                const side = getNodeSide(this, data);
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
export function getMindMapOptions({ type, direction, nodeMinWidth, nodeMaxWidth, labelField, }) {
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
                        const label = formatLabel(data, labelField);
                        const { font } = getBoxedTextNodeStyle(label, minWidth, maxWidth, depth);
                        const props = { text: label, color, maxWidth, font };
                        Object.assign(props, depth === 0
                            ? { type: 'filled', color: '#f1f4f5', style: { color: '#252525' } }
                            : depth === 1
                                ? { type: 'filled' }
                                : { type: 'outlined' });
                        return React.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = formatLabel(data, labelField);
                        return getBoxedTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                    },
                    dx: function (data) {
                        const side = getNodeSide(this, data);
                        const label = formatLabel(data, labelField);
                        const [width] = getBoxedTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                        return side === 'left' ? -width : side === 'center' ? -width / 2 : 0;
                    },
                    ports: [{ placement: 'left' }, { placement: 'right' }],
                },
            },
            edge: {
                style: {
                    stroke: function (data) {
                        const source = this.getNodeData(data.source);
                        return get(source, 'style.color', '#99ADD1');
                    },
                },
            },
            transforms: (prev) => [...prev, { type: 'assign-color-by-branch', key: 'assign-color-by-branch' }],
            layout: {
                type: 'mindmap',
                getHeight: (data) => {
                    const label = formatLabel(data, labelField);
                    const [, height] = getBoxedTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
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
                        const side = getNodeSide(this, data);
                        const depth = data.depth;
                        const color = data.style?.color;
                        const label = formatLabel(data, labelField);
                        const { font } = getLinearTextNodeStyle(label, minWidth, maxWidth, depth);
                        const props = { text: label, color, maxWidth, font };
                        Object.assign(props, depth === 0
                            ? { type: 'filled', color: '#f1f4f5', style: { color: '#252525' } }
                            : {
                                type: 'underlined',
                                style: side === 'left' ? { textAlign: 'right' } : side === 'center' ? { textAlign: 'center' } : {},
                            });
                        return React.createElement(TextNode, { ...props });
                    },
                    size: (data) => {
                        const label = formatLabel(data, labelField);
                        return getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                    },
                    dx: function (data) {
                        const side = getNodeSide(this, data);
                        const label = formatLabel(data, labelField);
                        const [width] = getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                        return side === 'left' ? -width : side === 'center' ? -width / 2 : 0;
                    },
                    dy: function (data) {
                        const label = formatLabel(data, labelField);
                        const [, height] = getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
                        return height / 2;
                    },
                    ports: function (data) {
                        const side = getNodeSide(this, data);
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
                        return get(target, 'style.color', '#99ADD1');
                    },
                },
            },
            layout: {
                type: 'mindmap',
                getHeight: (data) => {
                    const label = formatLabel(data, labelField);
                    const [, height] = getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
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
                        const label = formatLabel(data, labelField);
                        const [, height] = getLinearTextNodeStyle(label, minWidth, maxWidth, data.depth).size;
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
                        const label = formatLabel(data, labelField);
                        return React.createElement(TextNode, { type: "filled", text: label });
                    },
                    size: (data) => {
                        const label = formatLabel(data, labelField);
                        return measureTextSize(label, PADDING);
                    },
                    dx: function (data) {
                        const side = getNodeSide(this, data);
                        const label = formatLabel(data, labelField);
                        const [width] = measureTextSize(label, PADDING);
                        return side === 'left' ? -width : side === 'center' ? -width / 2 : 0;
                    },
                    ports: [{ placement: 'left' }, { placement: 'right' }],
                },
            },
            layout: {
                type: 'mindmap',
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
        options.layout.direction =
            direction === 'alternate' ? 'H' : direction === 'left' ? 'RL' : 'LR';
    }
    return options;
}
