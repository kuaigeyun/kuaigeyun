import { Coordinates } from '../../types';
import GraphElement from './GraphElement';
import Point from './Point';
export default class Plot extends GraphElement {
    points: Coordinates[];
    constructor(points?: Coordinates[]);
    getPoints(): Coordinates[];
    translate(translationVector: Coordinates): void;
    isEqual(element: GraphElement): boolean;
    orthoProjection(P: Point): Point;
}
