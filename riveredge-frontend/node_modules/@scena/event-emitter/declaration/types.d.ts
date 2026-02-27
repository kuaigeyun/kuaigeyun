export declare type TargetParam<Param> = Pick<Param, Exclude<keyof Param, keyof EmitterParam>> & Partial<EmitterParam>;
export interface EmitterParam<Target = any> {
    type: string;
    currentTarget: Target;
    stop(): void;
}
export declare type OnEvent<Param, Target = any> = EmitterParam<Target> & Param;
export declare type EventHash<Events, Target> = Partial<{
    [Key in keyof Events]: EventListener<Events[Key], Target>;
}>;
export declare type EventListener<Param, Target> = (e: OnEvent<Param, Target>) => any;
export interface EventOptions {
    once: boolean;
}
export interface EventInfo extends Partial<EventOptions> {
    listener: EventListener<any, any>;
}
