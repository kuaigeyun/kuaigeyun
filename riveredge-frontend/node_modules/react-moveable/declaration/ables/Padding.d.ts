import { Renderer, MoveableManagerInterface } from "../types";
declare const _default: {
    readonly events: readonly [];
    readonly props: readonly ["padding"];
    readonly name: "padding";
} & {
    props: readonly ["padding"];
    render(moveable: MoveableManagerInterface, React: Renderer): any[];
};
export default _default;
/**
 * Add padding around the target to increase the drag area.
 * @name Moveable#padding
 * @default null
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  target: document.querySelector(".target"),
 *  padding: { left: 0, top: 0, right: 0, bottom: 0 },
 * });
 * moveable.padding = { left: 10, top: 10, right: 10, bottom: 10 },
 * moveable.updateRect();
 */
