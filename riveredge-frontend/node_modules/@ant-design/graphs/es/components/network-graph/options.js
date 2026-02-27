const SIZE = 32;
export const DEFAULT_OPTIONS = {
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
