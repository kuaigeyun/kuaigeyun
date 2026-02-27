
/**
 * @memberof EventEmitter
 * @typedef
 */
export type TargetParam<Param> = Pick<Param, Exclude<keyof Param, keyof EmitterParam>> & Partial<EmitterParam>;

/**
 * @memberof EventEmitter
 * @typedef
 */
export interface EmitterParam<Target = any> {
    type: string;
    currentTarget: Target;
    stop(): void;
}
/**
 * @memberof EventEmitter
 * @typedef
 */
export type OnEvent<Param, Target = any> = EmitterParam<Target> & Param;
/**
 * @memberof EventEmitter
 * @typedef
 */
export type EventHash<Events, Target> = Partial<{ [Key in keyof Events]: EventListener<Events[Key], Target> }>;
/**
 * @memberof EventEmitter
 * @typedef
 */
export type EventListener<Param, Target> = (e: OnEvent<Param, Target>) => any;

/**
 * @memberof EventEmitter
 * @typedef
 */
export interface EventOptions {
    once: boolean;
}

/**
 * @memberof EventEmitter
 * @typedef
 */
export interface EventInfo extends Partial<EventOptions> {
    listener: EventListener<any, any>;
}
