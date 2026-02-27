import { Polyline } from '@antv/g6';
export class IndentedEdge extends Polyline {
    getControlPoints(attributes) {
        const [sourcePoint, targetPoint] = this.getEndpoints(attributes, false);
        const [sx] = sourcePoint;
        const [, ty] = targetPoint;
        return [[sx, ty]];
    }
}
