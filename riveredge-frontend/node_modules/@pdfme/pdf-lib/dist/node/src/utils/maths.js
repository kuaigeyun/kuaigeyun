"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotate = exports.angleABC = exports.angle = exports.unitVector = exports.orientation = exports.vector = exports.minus = exports.times = exports.plus = exports.scalar = exports.isProportional = exports.isEqual = exports.isColinear = exports.orthogonal = exports.norm = exports.distanceCoords = exports.distance = exports.FLOAT_APPROXIMATION = void 0;
/** This value represents the precision we accept for float values */
exports.FLOAT_APPROXIMATION = 0.000001;
/** Calculates the distance between 2 points */
const distance = (A, B) => (0, exports.norm)((0, exports.vector)(A, B));
exports.distance = distance;
const distanceCoords = (A, B) => (0, exports.norm)((0, exports.minus)(B, A));
exports.distanceCoords = distanceCoords;
/** Calculates the distance denoted by a vector */
const norm = (vect) => Math.sqrt(vect.x * vect.x + vect.y * vect.y);
exports.norm = norm;
/** Calculates the orthogonal vector of provided vector */
const orthogonal = ({ x, y }) => ({
    x: -y,
    y: x,
});
exports.orthogonal = orthogonal;
/** Check if 2 vectors are proportional */
const isColinear = ({ x: ux, y: uy }, { x: vx, y: vy }) => (0, exports.isEqual)(ux * vy, uy * vx);
exports.isColinear = isColinear;
/** Check if 2 floating values can be considered equals */
const isEqual = (a, b) => Math.round(Math.abs(a - b) / exports.FLOAT_APPROXIMATION) === 0;
exports.isEqual = isEqual;
/** Return true if a is proportional to b: (a = kb), considering float imprecision */
const isProportional = (a, b) => (0, exports.isEqual)((Math.abs(a) + exports.FLOAT_APPROXIMATION / 10) % b, 0);
exports.isProportional = isProportional;
/** Calculate the scalar product between 2 vectors */
const scalar = ({ x: ux, y: uy }, { x: vx, y: vy }) => ux * vx + uy * vy;
exports.scalar = scalar;
/** Calculate the sum of 2 vectors */
const plus = ({ x: ux, y: uy }, { x: vx, y: vy }) => ({ x: ux + vx, y: uy + vy });
exports.plus = plus;
/** Calculate the vector multiplied by a scalar */
const times = ({ x, y }, k = 1) => ({
    x: k * x,
    y: k * y,
});
exports.times = times;
/** Calculate the difference of 2 vectors */
const minus = (u, v) => (0, exports.plus)(u, (0, exports.times)(v, -1));
exports.minus = minus;
/** Returns the vector between 2 points. */
const vector = (A, B) => (0, exports.minus)(B.toCoords(), A.toCoords());
exports.vector = vector;
/**
 * Returns the angle between the vector and the horizontal axis (Ox).
 * The return value is between -PI and PI.
 * @returns {number} angle in radian between -Pi and Pi
 */
const orientation = ({ x, y }) => {
    const alpha = Math.acos(x / Math.sqrt(x * x + y * y));
    return y > 0 ? alpha : -alpha;
};
exports.orientation = orientation;
/** Returns the unit vector associated to the provided vector,
 * or the Null vector (0, 0) if the vector is null
 */
const unitVector = (u) => {
    const l = (0, exports.norm)(u);
    return l > 0 ? (0, exports.times)(u, 1 / l) : u;
};
exports.unitVector = unitVector;
/** Returns the angle from u to v in radian */
const angle = (u, v, previousAngle = 0) => {
    let sweep = (0, exports.orientation)(v) - (0, exports.orientation)(u);
    // If the angle has the same sign as the arc orientation, we return the angle as is
    // Otherwise, we need to correct the value, adding or removing 2π
    while (Math.abs(previousAngle - sweep) > Math.PI) {
        sweep += Math.sign(previousAngle - sweep) * 2 * Math.PI;
    }
    return sweep;
};
exports.angle = angle;
/** Returns the angle between the lines (BA) and (BC) in radian
 * @returns {number} the angle in radian, between -Pi and Pi
 */
const angleABC = (A, B, C, previousAngle = 0) => (0, exports.angle)((0, exports.vector)(B, A), (0, exports.vector)(B, C), previousAngle);
exports.angleABC = angleABC;
/** Rotate the vector by an angle in radian */
const rotate = (vect, teta) => {
    const { x, y } = vect;
    const nx = x * Math.cos(teta) - y * Math.sin(teta);
    const ny = y * Math.cos(teta) + x * Math.sin(teta);
    return { x: nx, y: ny };
};
exports.rotate = rotate;
//# sourceMappingURL=maths.js.map