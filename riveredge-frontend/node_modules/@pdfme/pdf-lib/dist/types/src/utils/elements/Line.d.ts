import { Coordinates } from '../../types';
import GraphElement from './GraphElement';
import Point from './Point';
export default class Line extends GraphElement {
    origin(): Point;
    dirVect(): Coordinates;
    A: Point;
    B: Point;
    constructor(A?: Point, B?: Point);
    /** Line equation */
    y(x: number): number;
    /** The slope */
    a(): number;
    /** Origin y coordinate */
    b(): number;
    isEqual(element: GraphElement): boolean;
    /** Reversed line equation */
    x(y: number): number;
    includes(P: Point): boolean;
    /** This is used to standarsize type Segment | HalfLine | Line */
    getLine(): Line;
    orthoProjection(P: Point): Point;
}
