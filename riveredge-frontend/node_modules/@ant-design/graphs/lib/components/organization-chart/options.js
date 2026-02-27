"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
exports.getOrganizationChartOptions = getOrganizationChartOptions;
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
function getOrganizationChartOptions({ direction, labelField, }) {
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
        transforms: (prev) => [
            ...prev,
            {
                type: 'collapse-expand-react-node',
                key: 'collapse-expand-react-node',
                iconPlacement: direction === 'vertical' ? 'bottom' : 'right',
                enable: false,
                refreshLayout: true,
            },
        ],
        layout: {
            type: 'dagre',
            rankdir: direction === 'vertical' ? 'TB' : 'LR',
        },
    };
    return options;
}
