import { Renderer, RoundableProps, OnRoundStart, RoundableState, OnRound, OnRoundEnd, MoveableManagerInterface, OnRoundGroup, MoveableGroupInterface, OnRoundGroupEnd } from "../types";
/**
 * @namespace Moveable.Roundable
 * @description Whether to show and drag or double click border-radius
 */
declare const _default: {
    name: string;
    props: readonly ["roundable", "roundRelative", "minRoundControls", "maxRoundControls", "roundClickable", "roundPadding", "isDisplayShadowRoundControls"];
    events: readonly ["roundStart", "round", "roundEnd", "roundGroupStart", "roundGroup", "roundGroupEnd"];
    css: string[];
    className(moveable: MoveableManagerInterface<RoundableProps, RoundableState>): string;
    requestStyle(): Array<keyof CSSStyleDeclaration>;
    requestChildStyle(): Array<keyof CSSStyleDeclaration>;
    render(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, React: Renderer): any;
    dragControlCondition(moveable: any, e: any): boolean;
    dragGroupControlCondition(moveable: any, e: any): boolean;
    dragControlStart(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any): false | OnRoundStart;
    dragControl(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any): false | OnRound;
    dragControlEnd(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any): false | OnRoundEnd;
    dragGroupControlStart(moveable: MoveableGroupInterface<RoundableProps, RoundableState>, e: any): false | OnRoundStart;
    dragGroupControl(moveable: MoveableGroupInterface<RoundableProps, RoundableState>, e: any): false | OnRoundGroup;
    dragGroupControlEnd(moveable: MoveableGroupInterface<RoundableProps, RoundableState>, e: any): false | OnRoundGroupEnd;
    unset(moveable: MoveableManagerInterface<RoundableProps, RoundableState>): void;
};
export default _default;
/**
 * Whether to show and drag or double click border-radius, (default: false)
 * @name Moveable.Roundable#roundable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * % Can be used instead of the absolute px
 * @name Moveable.Roundable#roundRelative
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * Minimum number of round controls. It moves in proportion by control. [horizontal, vertical] (default: [0, 0])
 * @name Moveable.Roundable#minRoundControls
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 *     minRoundControls: [0, 0],
 * });
 * moveable.minRoundControls = [1, 0];
 */
/**
 * Maximum number of round controls. It moves in proportion by control. [horizontal, vertical] (default: [4, 4])
 * @name Moveable.Roundable#maxRoundControls
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 *     maxRoundControls: [4, 4],
 * });
 * moveable.maxRoundControls = [1, 0];
 */
/**
 * Whether you can add/delete round controls by double-clicking a line or control.
 * @name Moveable.Roundable#roundClickable
 * @default true
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 *     roundClickable: true,
 * });
 * moveable.roundClickable = false;
 */
/**
 * Whether to show a round control that does not actually exist as a shadow
 * @name Moveable.Roundable#isDisplayShadowRoundControls
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     isDisplayShadowRoundControls: false,
 * });
 * moveable.isDisplayShadowRoundControls = true;
 */
/**
 * The padding value of the position of the round control
 * @name Moveable.Roundable#roundPadding
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundPadding: 0,
 * });
 * moveable.roundPadding = 15;
 */
/**
 * When drag start the clip area or controls, the `roundStart` event is called.
 * @memberof Moveable.Roundable
 * @event roundStart
 * @param {Moveable.Roundable.OnRoundStart} - Parameters for the `roundStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag or double click the border area or controls, the `round` event is called.
 * @memberof Moveable.Roundable
 * @event round
 * @param {Moveable.Roundable.OnRound} - Parameters for the `round` event
 * @example
  * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag end the border area or controls, the `roundEnd` event is called.
 * @memberof Moveable.Roundable
 * @event roundEnd
 * @param {Moveable.Roundable.onRoundEnd} - Parameters for the `roundEnd` event
 * @example
  * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag start the clip area or controls, the `roundGroupStart` event is called.
 * @memberof Moveable.Roundable
 * @event roundGroupStart
 * @param {Moveable.Roundable.OnRoundGroupStart} - Parameters for the `roundGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     targets: [target1, target2, target3],
 *     roundable: true,
 * });
 * moveable.on("roundGroupStart", e => {
 *     console.log(e.targets);
 * }).on("roundGroup", e => {
 *   e.events.forEach(ev => {
 *       ev.target.style.cssText += ev.cssText;
 *   });
 * }).on("roundGroupEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag or double click the border area or controls, the `roundGroup` event is called.
 * @memberof Moveable.Roundable
 * @event roundGroup
 * @param {Moveable.Roundable.OnRoundGroup} - Parameters for the `roundGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     targets: [target1, target2, target3],
 *     roundable: true,
 * });
 * moveable.on("roundGroupStart", e => {
 *     console.log(e.targets);
 * }).on("roundGroup", e => {
 *   e.events.forEach(ev => {
 *       ev.target.style.cssText += ev.cssText;
 *   });
 * }).on("roundGroupEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag end the border area or controls, the `roundGroupEnd` event is called.
 * @memberof Moveable.Roundable
 * @event roundGroupEnd
 * @param {Moveable.Roundable.onRoundGroupEnd} - Parameters for the `roundGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     targets: [target1, target2, target3],
 *     roundable: true,
 * });
 * moveable.on("roundGroupStart", e => {
 *     console.log(e.targets);
 * }).on("roundGroup", e => {
 *     e.events.forEach(ev => {
 *         ev.target.style.cssText += ev.cssText;
 *     });
 * }).on("roundGroupEnd", e => {
 *     console.log(e);
 * });
 */
