export interface IMiddleware<Payload = any, Result = any> {
    (payload: Payload, next: (payload?: Payload) => Result): Result;
}
export declare const applyMiddleware: (payload: any, fns?: IMiddleware[]) => Promise<unknown>;
