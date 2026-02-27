import Point from './elements/Point';
import { Coordinates } from '../types';
/** This value represents the precision we accept for float values */
export declare const FLOAT_APPROXIMATION = 0.000001;
/** Calculates the distance between 2 points */
export declare const distance: (A: Point, B: Point) => number;
export declare const distanceCoords: (A: Coordinates, B: Coordinates) => number;
/** Calculates the distance denoted by a vector */
export declare const norm: (vect: Coordinates) => number;
/** Calculates the orthogonal vector of provided vector */
export declare const orthogonal: ({ x, y }: Coordinates) => Coordinates;
/** Check if 2 vectors are proportional */
export declare const isColinear: ({ x: ux, y: uy }: Coordinates, { x: vx, y: vy }: Coordinates) => boolean;
/** Check if 2 floating values can be considered equals */
export declare const isEqual: (a: number, b: number) => boolean;
/** Return true if a is proportional to b: (a = kb), considering float imprecision */
export declare const isProportional: (a: number, b: number) => boolean;
/** Calculate the scalar product between 2 vectors */
export declare const scalar: ({ x: ux, y: uy }: Coordinates, { x: vx, y: vy }: Coordinates) => number;
/** Calculate the sum of 2 vectors */
export declare const plus: ({ x: ux, y: uy }: Coordinates, { x: vx, y: vy }: Coordinates) => Coordinates;
/** Calculate the vector multiplied by a scalar */
export declare const times: ({ x, y }: Coordinates, k?: number) => Coordinates;
/** Calculate the difference of 2 vectors */
export declare const minus: (u: Coordinates, v: Coordinates) => Coordinates;
/** Returns the vector between 2 points. */
export declare const vector: (A: Point, B: Point) => Coordinates;
/**
 * Returns the angle between the vector and the horizontal axis (Ox).
 * The return value is between -PI and PI.
 * @returns {number} angle in radian between -Pi and Pi
 */
export declare const orientation: ({ x, y }: Coordinates) => number;
/** Returns the unit vector associated to the provided vector,
 * or the Null vector (0, 0) if the vector is null
 */
export declare const unitVector: (u: Coordinates) => Coordinates;
/** Returns the angle from u to v in radian */
export declare const angle: (u: Coordinates, v: Coordinates, previousAngle?: number) => number;
/** Returns the angle between the lines (BA) and (BC) in radian
 * @returns {number} the angle in radian, between -Pi and Pi
 */
export declare const angleABC: (A: Point, B: Point, C: Point, previousAngle?: number) => number;
/** Rotate the vector by an angle in radian */
export declare const rotate: (vect: Coordinates, teta: number) => Coordinates;
