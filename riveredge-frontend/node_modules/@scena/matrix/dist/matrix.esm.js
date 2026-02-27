/*
Copyright (c) 2020 Daybrush
name: @scena/matrix
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/matrix
version: 1.1.1
*/
import { throttle, TINY_NUM, average } from '@daybrush/utils';

function add(matrix, inverseMatrix, startIndex, fromIndex, n, k) {
  for (var i = 0; i < n; ++i) {
    var x = startIndex + i * n;
    var fromX = fromIndex + i * n;
    matrix[x] += matrix[fromX] * k;
    inverseMatrix[x] += inverseMatrix[fromX] * k;
  }
}

function swap(matrix, inverseMatrix, startIndex, fromIndex, n) {
  for (var i = 0; i < n; ++i) {
    var x = startIndex + i * n;
    var fromX = fromIndex + i * n;
    var v = matrix[x];
    var iv = inverseMatrix[x];
    matrix[x] = matrix[fromX];
    matrix[fromX] = v;
    inverseMatrix[x] = inverseMatrix[fromX];
    inverseMatrix[fromX] = iv;
  }
}

function divide(matrix, inverseMatrix, startIndex, n, k) {
  for (var i = 0; i < n; ++i) {
    var x = startIndex + i * n;
    matrix[x] /= k;
    inverseMatrix[x] /= k;
  }
}
/**
 *
 * @namespace Matrix
 */

/**
 * @memberof Matrix
 */


function ignoreDimension(matrix, m, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }

  var newMatrix = matrix.slice();

  for (var i = 0; i < n; ++i) {
    newMatrix[i * n + m - 1] = 0;
    newMatrix[(m - 1) * n + i] = 0;
  }

  newMatrix[(m - 1) * (n + 1)] = 1;
  return newMatrix;
}
/**
 * @memberof Matrix
 */

function invert(matrix, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }

  var newMatrix = matrix.slice();
  var inverseMatrix = createIdentityMatrix(n);

  for (var i = 0; i < n; ++i) {
    // diagonal
    var identityIndex = n * i + i;

    if (!throttle(newMatrix[identityIndex], TINY_NUM)) {
      // newMatrix[identityIndex] = 0;
      for (var j = i + 1; j < n; ++j) {
        if (newMatrix[n * i + j]) {
          swap(newMatrix, inverseMatrix, i, j, n);
          break;
        }
      }
    }

    if (!throttle(newMatrix[identityIndex], TINY_NUM)) {
      // no inverse matrix
      return [];
    }

    divide(newMatrix, inverseMatrix, i, n, newMatrix[identityIndex]);

    for (var j = 0; j < n; ++j) {
      var targetStartIndex = j;
      var targetIndex = j + i * n;
      var target = newMatrix[targetIndex];

      if (!throttle(target, TINY_NUM) || i === j) {
        continue;
      }

      add(newMatrix, inverseMatrix, targetStartIndex, i, n, -target);
    }
  }

  return inverseMatrix;
}
/**
 * @memberof Matrix
 */

function transpose(matrix, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }

  var newMatrix = [];

  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < n; ++j) {
      newMatrix[j * n + i] = matrix[n * i + j];
    }
  }

  return newMatrix;
}
/**
 * @memberof Matrix
 */

function getOrigin(matrix, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }

  var originMatrix = [];
  var w = matrix[n * n - 1];

  for (var i = 0; i < n - 1; ++i) {
    originMatrix[i] = matrix[n * (n - 1) + i] / w;
  }

  originMatrix[n - 1] = 0;
  return originMatrix;
}
/**
 * @memberof Matrix
 */

function fromTranslation(pos, n) {
  var newMatrix = createIdentityMatrix(n);

  for (var i = 0; i < n - 1; ++i) {
    newMatrix[n * (n - 1) + i] = pos[i] || 0;
  }

  return newMatrix;
}
/**
 * @memberof Matrix
 */

function convertPositionMatrix(matrix, n) {
  var newMatrix = matrix.slice();

  for (var i = matrix.length; i < n - 1; ++i) {
    newMatrix[i] = 0;
  }

  newMatrix[n - 1] = 1;
  return newMatrix;
}
/**
 * @memberof Matrix
 */

function convertDimension(matrix, n, m) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  } // n < m


  if (n === m) {
    return matrix;
  }

  var newMatrix = createIdentityMatrix(m);
  var length = Math.min(n, m);

  for (var i = 0; i < length - 1; ++i) {
    for (var j = 0; j < length - 1; ++j) {
      newMatrix[i * m + j] = matrix[i * n + j];
    }

    newMatrix[(i + 1) * m - 1] = matrix[(i + 1) * n - 1];
    newMatrix[(m - 1) * m + i] = matrix[(n - 1) * n + i];
  }

  newMatrix[m * m - 1] = matrix[n * n - 1];
  return newMatrix;
}
/**
 * @memberof Matrix
 */

function multiplies(n) {
  var matrixes = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    matrixes[_i - 1] = arguments[_i];
  }

  var m = createIdentityMatrix(n);
  matrixes.forEach(function (matrix) {
    m = multiply(m, matrix, n);
  });
  return m;
}
/**
 * @memberof Matrix
 */

function multiply(matrix, matrix2, n) {
  if (n === void 0) {
    n = Math.sqrt(matrix.length);
  }

  var newMatrix = []; // 1 y: n
  // 1 x: m
  // 2 x: m
  // 2 y: k
  // n * m X m * k

  var m = matrix.length / n;
  var k = matrix2.length / m;

  if (!m) {
    return matrix2;
  } else if (!k) {
    return matrix;
  }

  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < k; ++j) {
      newMatrix[j * n + i] = 0;

      for (var l = 0; l < m; ++l) {
        // m1 x: m(l), y: n(i)
        // m2 x: k(j):  y: m(l)
        // nw x: n(i), y: k(j)
        newMatrix[j * n + i] += matrix[l * n + i] * matrix2[j * m + l];
      }
    }
  } // n * k


  return newMatrix;
}
/**
 * @memberof Matrix
 */

function plus(pos1, pos2) {
  var length = Math.min(pos1.length, pos2.length);
  var nextPos = pos1.slice();

  for (var i = 0; i < length; ++i) {
    nextPos[i] = nextPos[i] + pos2[i];
  }

  return nextPos;
}
/**
 * @memberof Matrix
 */

function minus(pos1, pos2) {
  var length = Math.min(pos1.length, pos2.length);
  var nextPos = pos1.slice();

  for (var i = 0; i < length; ++i) {
    nextPos[i] = nextPos[i] - pos2[i];
  }

  return nextPos;
}
/**
 * @memberof Matrix
 */

function convertCSStoMatrix(a, is2d) {
  if (is2d === void 0) {
    is2d = a.length === 6;
  }

  if (is2d) {
    return [a[0], a[1], 0, a[2], a[3], 0, a[4], a[5], 1];
  }

  return a;
}
/**
 * @memberof Matrix
 */

function convertMatrixtoCSS(a, is2d) {
  if (is2d === void 0) {
    is2d = a.length === 9;
  }

  if (is2d) {
    return [a[0], a[1], a[3], a[4], a[6], a[7]];
  }

  return a;
}
/**
 * @memberof Matrix
 */

function calculate(matrix, matrix2, n) {
  if (n === void 0) {
    n = matrix2.length;
  }

  var result = multiply(matrix, matrix2, n);
  var k = result[n - 1];
  return result.map(function (v) {
    return v / k;
  });
}
/**
 * @memberof Matrix
 */

function rotateX3d(matrix, rad) {
  return multiply(matrix, [1, 0, 0, 0, 0, Math.cos(rad), Math.sin(rad), 0, 0, -Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1], 4);
}
/**
 * @memberof Matrix
 */

function rotateY3d(matrix, rad) {
  return multiply(matrix, [Math.cos(rad), 0, -Math.sin(rad), 0, 0, 1, 0, 0, Math.sin(rad), 0, Math.cos(rad), 0, 0, 0, 0, 1], 4);
}
/**
 * @memberof Matrix
 */

function rotateZ3d(matrix, rad) {
  return multiply(matrix, createRotateMatrix(rad, 4));
}
/**
 * @memberof Matrix
 */

function scale3d(matrix, _a) {
  var _b = _a[0],
      sx = _b === void 0 ? 1 : _b,
      _c = _a[1],
      sy = _c === void 0 ? 1 : _c,
      _d = _a[2],
      sz = _d === void 0 ? 1 : _d;
  return multiply(matrix, [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1], 4);
}
/**
 * @memberof Matrix
 */

function rotate(pos, rad) {
  return calculate(createRotateMatrix(rad, 3), convertPositionMatrix(pos, 3));
}
/**
 * @memberof Matrix
 */

function translate3d(matrix, _a) {
  var _b = _a[0],
      tx = _b === void 0 ? 0 : _b,
      _c = _a[1],
      ty = _c === void 0 ? 0 : _c,
      _d = _a[2],
      tz = _d === void 0 ? 0 : _d;
  return multiply(matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1], 4);
}
/**
 * @memberof Matrix
 */

function matrix3d(matrix1, matrix2) {
  return multiply(matrix1, matrix2, 4);
}
/**
 * @memberof Matrix
 */

function createRotateMatrix(rad, n) {
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);
  var m = createIdentityMatrix(n); // cos -sin
  // sin cos

  m[0] = cos;
  m[1] = sin;
  m[n] = -sin;
  m[n + 1] = cos;
  return m;
}
/**
 * @memberof Matrix
 */

function createIdentityMatrix(n) {
  var length = n * n;
  var matrix = [];

  for (var i = 0; i < length; ++i) {
    matrix[i] = i % (n + 1) ? 0 : 1;
  }

  return matrix;
}
/**
 * @memberof Matrix
 */

function createScaleMatrix(scale, n) {
  var m = createIdentityMatrix(n);
  var length = Math.min(scale.length, n - 1);

  for (var i = 0; i < length; ++i) {
    m[(n + 1) * i] = scale[i];
  }

  return m;
}
/**
 * @memberof Matrix
 */

function createOriginMatrix(origin, n) {
  var m = createIdentityMatrix(n);
  var length = Math.min(origin.length, n - 1);

  for (var i = 0; i < length; ++i) {
    m[n * (n - 1) + i] = origin[i];
  }

  return m;
}
/**
 * @memberof Matrix
 */

function createWarpMatrix(pos0, pos1, pos2, pos3, nextPos0, nextPos1, nextPos2, nextPos3) {
  var x0 = pos0[0],
      y0 = pos0[1];
  var x1 = pos1[0],
      y1 = pos1[1];
  var x2 = pos2[0],
      y2 = pos2[1];
  var x3 = pos3[0],
      y3 = pos3[1];
  var u0 = nextPos0[0],
      v0 = nextPos0[1];
  var u1 = nextPos1[0],
      v1 = nextPos1[1];
  var u2 = nextPos2[0],
      v2 = nextPos2[1];
  var u3 = nextPos3[0],
      v3 = nextPos3[1];
  var matrix = [x0, 0, x1, 0, x2, 0, x3, 0, y0, 0, y1, 0, y2, 0, y3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, x0, 0, x1, 0, x2, 0, x3, 0, y0, 0, y1, 0, y2, 0, y3, 0, 1, 0, 1, 0, 1, 0, 1, -u0 * x0, -v0 * x0, -u1 * x1, -v1 * x1, -u2 * x2, -v2 * x2, -u3 * x3, -v3 * x3, -u0 * y0, -v0 * y0, -u1 * y1, -v1 * y1, -u2 * y2, -v2 * y2, -u3 * y3, -v3 * y3];
  var inverseMatrix = invert(matrix, 8);

  if (!inverseMatrix.length) {
    return [];
  }

  var h = multiply(inverseMatrix, [u0, v0, u1, v1, u2, v2, u3, v3], 8);
  h[8] = 1;
  return convertDimension(transpose(h), 3, 4);
}
/**
 * @memberof Matrix
 */

function getCenter(points) {
  return [0, 1].map(function (i) {
    return average(points.map(function (pos) {
      return pos[i];
    }));
  });
}

export { calculate, convertCSStoMatrix, convertDimension, convertMatrixtoCSS, convertPositionMatrix, createIdentityMatrix, createOriginMatrix, createRotateMatrix, createScaleMatrix, createWarpMatrix, fromTranslation, getCenter, getOrigin, ignoreDimension, invert, matrix3d, minus, multiplies, multiply, plus, rotate, rotateX3d, rotateY3d, rotateZ3d, scale3d, translate3d, transpose };
//# sourceMappingURL=matrix.esm.js.map
