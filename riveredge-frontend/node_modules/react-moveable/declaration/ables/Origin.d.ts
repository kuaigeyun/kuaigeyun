import { Renderer, OriginOptions, MoveableManagerInterface } from "../types";
declare const _default: {
    readonly events: readonly [];
    readonly props: readonly ["origin", "svgOrigin"];
    readonly name: "origin";
} & {
    props: readonly ["origin", "svgOrigin"];
    render(moveable: MoveableManagerInterface<OriginOptions>, React: Renderer): any[];
};
export default _default;
/**
 * Whether or not the origin controlbox will be visible or not (default: true)
 * @name Moveable#origin
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.origin = true;
 */
