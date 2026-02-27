import GraphElement from './GraphElement';
import Line from './Line';
import Point from './Point';
export default class Segment extends GraphElement {
    static type: string;
    A: Point;
    B: Point;
    constructor(A?: Point, B?: Point);
    origin(): Point;
    destination(): Point;
    dirVect(): import("../..").Coordinates;
    length(): number;
    isEqual(element: GraphElement): boolean;
    /** Returns an equivalent line object */
    getLine(): Line;
    includes(P: Point): boolean;
    middle(): Point;
    orthoProjection(P: Point): Point;
}
