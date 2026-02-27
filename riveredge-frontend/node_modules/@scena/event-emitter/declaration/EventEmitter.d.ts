import { EventListener, EventHash, OnEvent, TargetParam } from "./types";
declare class EventEmitter<Events extends {} = {
    [key: string]: {
        [key: string]: any;
    };
}> {
    private _events;
    on<Name extends keyof Events, Param = Events[Name]>(eventName: Name, listener: EventListener<Param, this>): this;
    on(events: EventHash<Events, this>): this;
    off<Name extends keyof Events, Param = Events[Name]>(eventName?: Name, listener?: EventListener<Param, this>): this;
    off(events: EventHash<Events, this>): this;
    once<Name extends keyof Events & string, Param = Events[Name]>(eventName: Name, listener?: EventListener<Param, this>): Promise<OnEvent<Param, this>>;
    emit<Name extends keyof Events, Param = Events[Name]>(eventName: {} extends Param ? Name : never): boolean;
    emit<Name extends keyof Events, Param = Events[Name]>(eventName: Name, param: TargetParam<Param>): boolean;
    trigger<Name extends keyof Events, Param = Events[Name]>(eventName: {} extends TargetParam<Param> ? Name : never): boolean;
    trigger<Name extends keyof Events, Param = Events[Name]>(eventName: Name, param: TargetParam<Param>): boolean;
    private _addEvent;
}
export default EventEmitter;
