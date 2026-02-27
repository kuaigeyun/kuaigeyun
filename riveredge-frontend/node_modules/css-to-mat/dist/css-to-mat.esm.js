/*
Copyright (c) 2019 Daybrush
name: css-to-mat
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/css-to-mat.git
version: 1.1.0
*/
import { isArray, splitSpace, splitBracket, isObject, splitComma, convertUnitSize, splitUnit } from '@daybrush/utils';
import { calculate, matrix3d, invert, translate3d, scale3d, rotateZ3d, rotateX3d, rotateY3d } from '@scena/matrix';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function createMatrix() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}
function parseMat(transform, size) {
    if (size === void 0) { size = 0; }
    return toMat(parse(transform, size));
}
function getElementMatrix(el) {
    return parseMat(getComputedStyle(el).transform);
}
function calculateMatrixDist(matrix, pos) {
    var res = calculate(matrix, [pos[0], pos[1] || 0, pos[2] || 0, 1], 4);
    var w = res[3] || 1;
    return [
        res[0] / w,
        res[1] / w,
        res[2] / w,
    ];
}
function getDistElementMatrix(el, container) {
    if (container === void 0) { container = document.body; }
    var target = el;
    var matrix = createMatrix();
    while (target) {
        var transform = getComputedStyle(target).transform;
        matrix = matrix3d(parseMat(transform), matrix);
        if (target === container) {
            break;
        }
        target = target.parentElement;
    }
    matrix = invert(matrix, 4);
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    return matrix;
}
function toMat(matrixInfos) {
    var target = createMatrix();
    matrixInfos.forEach(function (info) {
        var matrixFunction = info.matrixFunction, functionValue = info.functionValue;
        if (!matrixFunction) {
            return;
        }
        target = matrixFunction(target, functionValue);
    });
    return target;
}
function parse(transform, size) {
    if (size === void 0) { size = 0; }
    var transforms = isArray(transform) ? transform : splitSpace(transform);
    return transforms.map(function (t) {
        var _a = splitBracket(t), name = _a.prefix, value = _a.value;
        var matrixFunction = null;
        var functionName = name;
        var functionValue = "";
        if (name === "translate" || name === "translateX" || name === "translate3d") {
            var nextSize_1 = isObject(size) ? __assign(__assign({}, size), { "o%": size["%"] }) : {
                "%": size,
                "o%": size,
            };
            var _b = splitComma(value).map(function (v, i) {
                if (i === 0 && "x%" in nextSize_1) {
                    nextSize_1["%"] = size["x%"];
                }
                else if (i === 1 && "y%" in nextSize_1) {
                    nextSize_1["%"] = size["y%"];
                }
                else {
                    nextSize_1["%"] = size["o%"];
                }
                return convertUnitSize(v, nextSize_1);
            }), posX = _b[0], _c = _b[1], posY = _c === void 0 ? 0 : _c, _d = _b[2], posZ = _d === void 0 ? 0 : _d;
            matrixFunction = translate3d;
            functionValue = [posX, posY, posZ];
        }
        else if (name === "translateY") {
            var nextSize = isObject(size) ? __assign({ "%": size["y%"] }, size) : {
                "%": size,
            };
            var posY = convertUnitSize(value, nextSize);
            matrixFunction = translate3d;
            functionValue = [0, posY, 0];
        }
        else if (name === "translateZ") {
            var posZ = parseFloat(value);
            matrixFunction = translate3d;
            functionValue = [0, 0, posZ];
        }
        else if (name === "scale" || name === "scale3d") {
            var _e = splitComma(value).map(function (v) { return parseFloat(v); }), sx = _e[0], _f = _e[1], sy = _f === void 0 ? sx : _f, _g = _e[2], sz = _g === void 0 ? 1 : _g;
            matrixFunction = scale3d;
            functionValue = [sx, sy, sz];
        }
        else if (name === "scaleX") {
            var sx = parseFloat(value);
            matrixFunction = scale3d;
            functionValue = [sx, 1, 1];
        }
        else if (name === "scaleY") {
            var sy = parseFloat(value);
            matrixFunction = scale3d;
            functionValue = [1, sy, 1];
        }
        else if (name === "scaleZ") {
            var sz = parseFloat(value);
            matrixFunction = scale3d;
            functionValue = [1, 1, sz];
        }
        else if (name === "rotate" || name === "rotateZ" || name === "rotateX" || name === "rotateY") {
            var _h = splitUnit(value), unit = _h.unit, unitValue = _h.value;
            var rad = unit === "rad" ? unitValue : unitValue * Math.PI / 180;
            if (name === "rotate" || name === "rotateZ") {
                functionName = "rotateZ";
                matrixFunction = rotateZ3d;
            }
            else if (name === "rotateX") {
                matrixFunction = rotateX3d;
            }
            else if (name === "rotateY") {
                matrixFunction = rotateY3d;
            }
            functionValue = rad;
        }
        else if (name === "matrix3d") {
            matrixFunction = matrix3d;
            functionValue = splitComma(value).map(function (v) { return parseFloat(v); });
        }
        else if (name === "matrix") {
            var m = splitComma(value).map(function (v) { return parseFloat(v); });
            matrixFunction = matrix3d;
            functionValue = [
                m[0], m[1], 0, 0,
                m[2], m[3], 0, 0,
                0, 0, 1, 0,
                m[4], m[5], 0, 1,
            ];
        }
        else {
            functionName = "";
        }
        return {
            name: name,
            functionName: functionName,
            value: value,
            matrixFunction: matrixFunction,
            functionValue: functionValue,
        };
    });
}

export { calculateMatrixDist, createMatrix, getDistElementMatrix, getElementMatrix, parse, parseMat, toMat };
//# sourceMappingURL=css-to-mat.esm.js.map
