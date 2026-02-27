import { Able, MoveableManagerInterface } from "./types";
export default class EventManager {
    private target;
    private moveable;
    private eventName;
    private ables;
    constructor(target: HTMLElement | SVGElement | null, moveable: MoveableManagerInterface | null, eventName: string);
    setAbles(ables: Able[]): void;
    destroy(): void;
    private _onEvent;
}
