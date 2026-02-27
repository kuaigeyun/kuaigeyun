import { Renderer, MoveableManagerInterface, RenderDirections } from "./types";
export interface DirectionControlInfo {
    data: Record<string, any>;
    classNames: string[];
    dir: string;
}
export declare function renderDirectionControlsByInfos(moveable: MoveableManagerInterface<Partial<RenderDirections>>, ableName: string, renderDirections: DirectionControlInfo[], React: Renderer): any[];
export declare function renderDirectionControls(moveable: MoveableManagerInterface<Partial<RenderDirections>>, defaultDirections: string[], ableName: string, React: Renderer): any[];
export declare function renderLine(React: Renderer, direction: string, pos1: number[], pos2: number[], zoom: number, key: number | string, ...classNames: string[]): any;
export declare function renderEdgeLines(React: Renderer, ableName: string, edge: true | string[], poses: number[][], zoom: number): any[];
export declare function getRenderDirections(ableName: string): (moveable: MoveableManagerInterface<Partial<RenderDirections>>, React: Renderer) => any[];
export declare function renderAllDirections(moveable: MoveableManagerInterface<Partial<RenderDirections>>, ableName: string, React: Renderer): any[];
export declare function renderDiagonalDirections(moveable: MoveableManagerInterface<Partial<RenderDirections>>, ableName: string, React: Renderer): any[];
export declare function renderAroundControls(moveable: MoveableManagerInterface<Partial<RenderDirections>>, React: Renderer, ableName?: string, renderDirections?: string[]): any[];
