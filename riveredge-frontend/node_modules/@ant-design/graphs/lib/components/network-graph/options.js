"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
const SIZE = 32;
exports.DEFAULT_OPTIONS = {
    node: {
        type: 'circle',
    },
    layout: {
        type: 'd3-force',
        link: {
            distance: SIZE * 4,
        },
        collide: {
            radius: SIZE,
        },
        manyBody: {
            strength: -SIZE * 22,
        },
        x: {},
        y: {},
    },
};
