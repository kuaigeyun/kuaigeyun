import { register } from '@antv/g2';
export var reisterShape = function () {
    /**
     * Draw 2.5d column shape.
     */
    var draw25DColumn = function (style, context) {
        return function (points) {
            var _a = style.fill, fill = _a === void 0 ? '#2888FF' : _a, stroke = style.stroke, _b = style.fillOpacity, fillOpacity = _b === void 0 ? 1 : _b, _c = style.strokeOpacity, strokeOpacity = _c === void 0 ? 0.2 : _c, _d = style.pitch, pitch = _d === void 0 ? 8 : _d;
            var x3 = points[1][0] - points[0][0];
            var x4 = x3 / 2 + points[0][0];
            var document = context.document;
            var g = document.createElement('g', {});
            var left = document.createElement('polygon', {
                style: {
                    points: [
                        [points[0][0], points[0][1]],
                        [x4, points[1][1] + pitch],
                        [x4, points[3][1] + pitch],
                        [points[3][0], points[3][1]],
                    ],
                    fill: fill,
                    fillOpacity: fillOpacity,
                    stroke: stroke,
                    strokeOpacity: strokeOpacity,
                    inset: 30,
                },
            });
            var right = document.createElement('polygon', {
                style: {
                    points: [
                        [x4, points[1][1] + pitch],
                        [points[1][0], points[1][1]],
                        [points[2][0], points[2][1]],
                        [x4, points[2][1] + pitch],
                    ],
                    fill: fill,
                    fillOpacity: fillOpacity,
                    stroke: stroke,
                    strokeOpacity: strokeOpacity,
                },
            });
            var top = document.createElement('polygon', {
                style: {
                    points: [
                        [points[0][0], points[0][1]],
                        [x4, points[1][1] - pitch],
                        [points[1][0], points[1][1]],
                        [x4, points[1][1] + pitch],
                    ],
                    fill: fill,
                    fillOpacity: fillOpacity - 0.2,
                },
            });
            g.appendChild(right);
            g.appendChild(left);
            g.appendChild(top);
            return g;
        };
    };
    // @ts-ignore
    register('shape.interval.column25D', draw25DColumn);
};
