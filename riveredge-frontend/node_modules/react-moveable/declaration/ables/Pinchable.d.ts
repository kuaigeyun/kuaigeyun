import { PinchableProps, SnappableState, MoveableManagerInterface, MoveableGroupInterface } from "../types";
/**
 * @namespace Moveable.Pinchable
 * @description Whether or not target can be pinched with draggable, resizable, scalable, rotatable (default: false)
 */
declare const _default: {
    readonly events: readonly ["pinchStart", "pinch", "pinchEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd"];
    readonly props: readonly ["pinchable"];
    readonly name: "pinchable";
} & {
    props: readonly ["pinchable"];
    events: readonly ["pinchStart", "pinch", "pinchEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd"];
    dragStart(): boolean;
    pinchStart(moveable: MoveableManagerInterface<PinchableProps, SnappableState>, e: any): any;
    pinch(moveable: MoveableManagerInterface<PinchableProps>, e: any): any;
    pinchEnd(moveable: MoveableManagerInterface<PinchableProps>, e: any): any;
    pinchGroupStart(moveable: MoveableGroupInterface<any, any>, e: any): any;
    pinchGroup(moveable: MoveableGroupInterface, e: any): any;
    pinchGroupEnd(moveable: MoveableGroupInterface, e: any): any;
};
export default _default;
/**
 * Whether or not target can be pinched with draggable, resizable, scalable, rotatable (default: false)
 * @name Moveable.Pinchable#pinchable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.pinchable = true;
 */
/**
 * When the pinch starts, the pinchStart event is called with part of scaleStart, rotateStart, resizeStart
 * @memberof Moveable.Pinchable
 * @event pinchStart
 * @param {Moveable.Pinchable.OnPinchStart} - Parameters for the pinchStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     rotatable: true,
 *     scalable: true,
 *     pinchable: true, // ["rotatable", "scalable"]
 * });
 * moveable.on("pinchStart", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("rotateStart", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("scaleStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When pinching, the pinch event is called with part of scale, rotate, resize
 * @memberof Moveable.Pinchable
 * @event pinch
 * @param {Moveable.Pinchable.OnPinch} - Parameters for the pinch event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     rotatable: true,
 *     scalable: true,
 *     pinchable: true, // ["rotatable", "scalable"]
 * });
 * moveable.on("pinch", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("rotate", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("scale", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When the pinch finishes, the pinchEnd event is called.
 * @memberof Moveable.Pinchable
 * @event pinchEnd
 * @param {Moveable.Pinchable.OnPinchEnd} - Parameters for the pinchEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     rotatable: true,
 *     scalable: true,
 *     pinchable: true, // ["rotatable", "scalable"]
 * });
 * moveable.on("pinchEnd", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("rotateEnd", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("scaleEnd", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When the group pinch starts, the `pinchGroupStart` event is called.
 * @memberof Moveable.Pinchable
 * @event pinchGroupStart
 * @param {Moveable.Pinchable.OnPinchGroupStart} - Parameters for the `pinchGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     pinchable: true
 * });
 * moveable.on("pinchGroupStart", ({ targets }) => {
 *     console.log("onPinchGroupStart", targets);
 * });
 */
/**
 * When the group pinch, the `pinchGroup` event is called.
 * @memberof Moveable.Pinchable
 * @event pinchGroup
 * @param {Moveable.Pinchable.OnPinchGroup} - Parameters for the `pinchGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     pinchable: true
 * });
 * moveable.on("pinchGroup", ({ targets, events }) => {
 *     console.log("onPinchGroup", targets);
 * });
 */
/**
 * When the group pinch finishes, the `pinchGroupEnd` event is called.
 * @memberof Moveable.Pinchable
 * @event pinchGroupEnd
 * @param {Moveable.Pinchable.OnPinchGroupEnd} - Parameters for the `pinchGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     pinchable: true
 * });
 * moveable.on("pinchGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onPinchGroupEnd", targets, isDrag);
 * });
 */
