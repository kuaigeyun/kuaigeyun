import GraphElement from './GraphElement';
import Point from './Point';
export default class Circle extends GraphElement {
    O: Point;
    r: number;
    constructor(O?: Point, r?: number);
    ray(): number;
    center(): Point;
    /** This is used to standardize type Circle | Arc */
    getCircle(): this;
    isEqual(element: GraphElement): boolean;
    includes(P: Point): boolean;
    orthoProjection(P: Point): Point;
}
