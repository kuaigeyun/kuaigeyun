import React from 'react';
import { RCNode } from '../../core/base';
import { formatLabel } from '../../core/utils/label';
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
            strokeOpacity: 0.5,
        },
        state: {
            active: {
                strokeOpacity: 1,
            },
        },
    },
    layout: {
        type: 'dagre',
        rankdir: 'LR',
        animation: false,
    },
    transforms: ['translate-react-node-origin'],
};
export const getFlowDirectionGraphOptions = ({ labelField, }) => {
    const options = {
        node: {
            style: {
                component: (data) => {
                    const label = formatLabel(data, labelField);
                    return React.createElement(TextNode, { type: "filled", text: label });
                },
                size: [100, 40],
                ports: [{ placement: 'left' }, { placement: 'right' }],
            },
        },
    };
    return options;
};
