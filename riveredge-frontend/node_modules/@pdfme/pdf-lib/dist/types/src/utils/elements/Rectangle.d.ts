import GraphElement from './GraphElement';
import Point from './Point';
export default class Rectangle extends GraphElement {
    static type: string;
    start: Point;
    end: Point;
    constructor(start?: Point, end?: Point);
    getSize(): {
        width: number;
        height: number;
    };
    getCoords(): {
        x: number;
        y: number;
    };
    getStart(): Point;
    getEnd(): Point;
    center(): Point;
    isEqual(element: GraphElement): boolean;
    orthoProjection(P: Point): Point;
}
