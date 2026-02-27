"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlowDirectionGraphOptions = exports.DEFAULT_OPTIONS = void 0;
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
const getFlowDirectionGraphOptions = ({ labelField, }) => {
    const options = {
        node: {
            style: {
                component: (data) => {
                    const label = (0, label_1.formatLabel)(data, labelField);
                    return react_1.default.createElement(TextNode, { type: "filled", text: label });
                },
                size: [100, 40],
                ports: [{ placement: 'left' }, { placement: 'right' }],
            },
        },
    };
    return options;
};
exports.getFlowDirectionGraphOptions = getFlowDirectionGraphOptions;
