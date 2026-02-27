import type { Point, PolylineStyleProps } from '@antv/g6';
import { Polyline } from '@antv/g6';
export declare class IndentedEdge extends Polyline {
    getControlPoints(attributes: Required<PolylineStyleProps>): Point[];
}
