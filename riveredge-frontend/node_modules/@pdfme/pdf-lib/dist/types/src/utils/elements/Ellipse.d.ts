import { Size } from '../../types';
import GraphElement from './GraphElement';
import Point from './Point';
import Segment from './Segment';
export default class Ellipse extends GraphElement {
    A: Point;
    B: Point;
    C: Point;
    constructor(A?: Point, B?: Point, C?: Point);
    center(): Point;
    axis(): Segment;
    a(): number;
    b(): number;
    rotation(): number;
    getSize(): Size;
    isEqual(element: GraphElement): boolean;
    includes(P: Point): boolean;
    orthoProjection(P: Point): Point;
    polarRay(teta: number): number;
}
