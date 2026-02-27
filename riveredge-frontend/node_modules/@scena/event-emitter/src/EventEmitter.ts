import { findIndex, isObject } from "@daybrush/utils";
import { EventListener, EventHash, EventInfo, EventOptions, OnEvent, TargetParam } from "./types";

/**
 * Implement EventEmitter on object or component.
 */
class EventEmitter<Events extends {} = { [key: string]: { [key: string]: any } }> {

    private _events: {
        [name: string]: EventInfo[],
    } = {};
    public on<Name extends keyof Events, Param = Events[Name]>(
        eventName: Name, listener: EventListener<Param, this>): this;
    public on(events: EventHash<Events, this>): this;
    /**
     * Add a listener to the registered event.
     * @param - Name of the event to be added
     * @param - listener function of the event to be added
     * @example
     * import EventEmitter from "@scena/event-emitter";
     * cosnt emitter = new EventEmitter();
     *
     * // Add listener in "a" event
     * emitter.on("a", () => {
     * });
     * // Add listeners
     * emitter.on({
     *  a: () => {},
     *  b: () => {},
     * });
     */
    public on(eventName: string | object, listener?: EventListener<Events[any], this>): this {
        if (isObject(eventName)) {
            for (const name in eventName) {
                this.on<any>(name, eventName[name]);
            }
        } else {
            this._addEvent(eventName, listener, {});
        }
        return this;
    }
    public off<Name extends keyof Events, Param = Events[Name]>(
        eventName?: Name, listener?: EventListener<Param, this>): this;
    public off(events: EventHash<Events, this>): this;
    /**
     * Remove listeners registered in the event target.
     * @param - Name of the event to be removed
     * @param - listener function of the event to be removed
     * @example
     * import EventEmitter from "@scena/event-emitter";
     * cosnt emitter = new EventEmitter();
     *
     * // Remove all listeners.
     * emitter.off();
     *
     * // Remove all listeners in "A" event.
     * emitter.off("a");
     *
     *
     * // Remove "listener" listener in "a" event.
     * emitter.off("a", listener);
     */
    public off(eventName?: string | object, listener?: EventListener<Events[any], this>): this {
        if (!eventName) {
            this._events = {};
        } else if(isObject(eventName)) {
            for (const name in eventName) {
                this.off<any>(name);
            }
        } else if (!listener) {
            this._events[eventName] = [];
        } else {
            const events = this._events[eventName];

            if (events) {
                const index = findIndex(events, e => e.listener === listener);

                if (index > -1) {
                    events.splice(index, 1);
                }
            }
        }
        return this;
    }
    /**
     * Add a disposable listener and Use promise to the registered event.
     * @param - Name of the event to be added
     * @param - disposable listener function of the event to be added
     * @example
     * import EventEmitter from "@scena/event-emitter";
     * cosnt emitter = new EventEmitter();
     *
     * // Add a disposable listener in "a" event
     * emitter.once("a", () => {
     * });
     *
     * // Use Promise
     * emitter.once("a").then(e => {
     * });
     */
    public once<Name extends keyof Events & string, Param = Events[Name]>(
        eventName: Name, listener?: EventListener<Param, this>): Promise<OnEvent<Param, this>> {
        if (listener) {
            this._addEvent(eventName, listener, { once: true });
        }
        return new Promise<OnEvent<Param, this>>(resolve => {
            this._addEvent(eventName, resolve, { once: true });
        });
    }
    public emit<Name extends keyof Events, Param = Events[Name]>(
        eventName: {} extends Param ? Name : never): boolean;
    public emit<Name extends keyof Events, Param = Events[Name]>(
        eventName: Name, param: TargetParam<Param>): boolean;
    /**
     * Fires an event to call listeners.
     * @param - Event name
     * @param - Event parameter
     * @return If false, stop the event.
     * @example
     *
     * import EventEmitter from "@scena/event-emitter";
     *
     *
     * const emitter = new EventEmitter();
     *
     * emitter.on("a", e => {
     * });
     *
     *
     * emitter.emit("a", {
     *   a: 1,
     * });
     */
    public emit(eventName: string, param: TargetParam<any> = {}): boolean {
        const events = this._events[eventName];

        if (!eventName || !events) {
            return true;
        }
        let isStop = false;

        param.eventType = eventName;
        param.stop = () => {
            isStop = true;
        };
        param.currentTarget = this;


        [...events].forEach(info => {
            info.listener(param);
            if (info.once) {
                this.off<any>(eventName, info.listener);
            }
        });

        return !isStop;
    }
    public trigger<Name extends keyof Events, Param = Events[Name]>(eventName: {} extends TargetParam<Param> ? Name : never): boolean;
    public trigger<Name extends keyof Events, Param = Events[Name]>(eventName: Name, param: TargetParam<Param>): boolean;
    /**
     * Fires an event to call listeners.
     * @param - Event name
     * @param - Event parameter
     * @return If false, stop the event.
     * @example
     *
     * import EventEmitter from "@scena/event-emitter";
     *
     *
     * const emitter = new EventEmitter();
     *
     * emitter.on("a", e => {
     * });
     *
     *
     * emitter.emit("a", {
     *   a: 1,
     * });
     *//**
     * Fires an event to call listeners.
     * @param - Event name
     * @param - Event parameter
     * @return If false, stop the event.
     * @example
     *
     * import EventEmitter from "@scena/event-emitter";
     *
     *
     * const emitter = new EventEmitter();
     *
     * emitter.on("a", e => {
     * });
     *
     * // emit
     * emitter.trigger("a", {
     *   a: 1,
     * });
     */
    public trigger<Name extends keyof Events>(eventName: Name, param: TargetParam<any>= {}): boolean {
        return this.emit<any>(eventName, param);
    }

    private _addEvent(eventName: string, listener: EventListener<Events[any], this>, options: Partial<EventOptions>) {
        const events = this._events;

        events[eventName] = events[eventName] || [];

        const listeners = events[eventName];

        listeners.push({ listener, ...options });
    }
}

export default EventEmitter;
