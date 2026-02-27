import Circle from './elements/Circle';
import Line from './elements/Line';
import { Coordinates, GraphicElement } from '../types';
export declare function intersections(A: GraphicElement, B: GraphicElement): Coordinates[];
export declare function intersection(A: GraphicElement, B: GraphicElement): Coordinates | undefined;
export declare function intersectionLine(A: Line, B: Line): Coordinates[];
export declare function intersectionCircleLine(A: Circle, B: Line): Coordinates[];
export declare function intersectionCircle(A: Circle, B: Circle): Coordinates[];
export declare function getIntersections(elements: GraphicElement[]): Coordinates[];
