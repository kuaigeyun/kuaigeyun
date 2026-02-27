import { MoveableManagerInterface, MoveableGroupInterface, ClickableProps } from "../types";
declare const _default: {
    readonly events: readonly ["click", "clickGroup"];
    readonly props: readonly ["clickable"];
    readonly name: "clickable";
} & {
    props: readonly ["clickable"];
    events: readonly ["click", "clickGroup"];
    always: true;
    dragRelation: "weak";
    dragStart(): void;
    dragControlStart(): void;
    dragGroupStart(moveable: MoveableManagerInterface<ClickableProps>, e: any): void;
    dragEnd(moveable: MoveableManagerInterface<ClickableProps>, e: any): void;
    dragGroupEnd(moveable: MoveableGroupInterface<ClickableProps>, e: any): void;
    dragControlEnd(moveable: MoveableManagerInterface<ClickableProps>, e: any): void;
    dragGroupControlEnd(moveable: MoveableManagerInterface<ClickableProps>, e: any): void;
};
export default _default;
/**
 * When you click on the element, the `click` event is called.
 * @memberof Moveable
 * @event click
 * @param {Moveable.OnClick} - Parameters for the `click` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("click", ({ hasTarget, containsTarget, targetIndex }) => {
 *     // If you click on an element other than the target and not included in the target, index is -1.
 *     console.log("onClickGroup", target, hasTarget, containsTarget, targetIndex);
 * });
 */
/**
 * When you click on the element inside the group, the `clickGroup` event is called.
 * @memberof Moveable
 * @event clickGroup
 * @param {Moveable.OnClickGroup} - Parameters for the `clickGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("clickGroup", ({ inputTarget, isTarget, containsTarget, targetIndex }) => {
 *     // If you click on an element other than the target and not included in the target, index is -1.
 *     console.log("onClickGroup", inputTarget, isTarget, containsTarget, targetIndex);
 * });
 */
