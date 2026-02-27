"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlowGraphOptions = exports.DEFAULT_OPTIONS = void 0;
const react_1 = __importDefault(require("react"));
const base_1 = require("../../core/base");
const label_1 = require("../../core/utils/label");
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
        type: 'polyline',
        style: {
            lineWidth: 2,
            endArrow: true,
            radius: 8,
            router: {
                type: 'orth',
            },
        },
    },
    layout: {
        type: 'dagre',
        animation: false,
    },
    transforms: ['translate-react-node-origin'],
};
const getFlowGraphOptions = ({ direction, labelField, }) => {
    const options = {
        node: {
            style: {
                component: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    return react_1.default.createElement(TextNode, { type: "filled", text: label });
                },
                size: [100, 40],
                ports: direction === 'vertical'
                    ? [{ placement: 'top' }, { placement: 'bottom' }]
                    : [{ placement: 'left' }, { placement: 'right' }],
            },
        },
        layout: {
            type: 'dagre',
            rankdir: direction === 'vertical' ? 'TB' : 'LR',
        },
    };
    return options;
};
exports.getFlowGraphOptions = getFlowGraphOptions;
