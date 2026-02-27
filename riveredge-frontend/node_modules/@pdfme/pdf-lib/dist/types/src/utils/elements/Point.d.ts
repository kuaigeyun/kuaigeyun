import type { Coordinates } from '../../types';
import GraphElement from './GraphElement';
export default class Point extends GraphElement {
    static type: string;
    x: number;
    y: number;
    constructor(coords?: {
        x: number;
        y: number;
    });
    toCoords(): {
        x: number;
        y: number;
    };
    isEqual(element: GraphElement): boolean;
    orthoProjection(): Point;
    plus(vect: Coordinates): Point;
}
