import { WarpableProps, ScalableProps, ResizableProps, Renderer, SnappableProps, SnappableState, MoveableManagerInterface } from "../types";
/**
 * @namespace Moveable.Warpable
 * @description Warpable indicates whether the target can be warped(distorted, bented).
 */
declare const _default: {
    name: string;
    ableGroup: string;
    props: readonly ["warpable", "renderDirections", "edge", "displayAroundControls"];
    events: readonly ["warpStart", "warp", "warpEnd"];
    viewClassName: (moveable: MoveableManagerInterface<{}, {}>) => string;
    render(moveable: MoveableManagerInterface<ResizableProps & ScalableProps & WarpableProps>, React: Renderer): any[];
    dragControlCondition(moveable: any, e: any): boolean;
    dragControlStart(moveable: MoveableManagerInterface<WarpableProps, SnappableState>, e: any): any;
    dragControl(moveable: MoveableManagerInterface<WarpableProps & SnappableProps, SnappableState>, e: any): boolean;
    dragControlEnd(moveable: MoveableManagerInterface<WarpableProps>, e: any): any;
};
export default _default;
/**
 * Whether or not target can be warped. (default: false)
 * @name Moveable.Warpable#warpable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.warpable = true;
 */
/**
* Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
* @name Moveable.Warpable#renderDirections
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     warpable: true,
*     renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
* });
*
* moveable.renderDirections = ["nw", "ne", "sw", "se"];
*/
/**
* When the warp starts, the warpStart event is called.
* @memberof Moveable.Warpable
* @event warpStart
* @param {Moveable.Warpable.OnWarpStart} - Parameters for the warpStart event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, { warpable: true });
* moveable.on("warpStart", ({ target }) => {
*     console.log(target);
* });
*/
/**
 * When warping, the warp event is called.
 * @memberof Moveable.Warpable
 * @event warp
 * @param {Moveable.Warpable.OnWarp} - Parameters for the warp event
 * @example
 * import Moveable from "moveable";
 * let matrix = [
 *  1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  0, 0, 0, 1,
 * ];
 * const moveable = new Moveable(document.body, { warpable: true });
 * moveable.on("warp", ({ target, transform, delta, multiply }) => {
 *    // target.style.transform = transform;
 *    matrix = multiply(matrix, delta);
 *    target.style.transform = `matrix3d(${matrix.join(",")})`;
 * });
 */
/**
 * When the warp finishes, the warpEnd event is called.
 * @memberof Moveable.Warpable
 * @event warpEnd
 * @param {Moveable.Warpable.OnWarpEnd} - Parameters for the warpEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { warpable: true });
 * moveable.on("warpEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
