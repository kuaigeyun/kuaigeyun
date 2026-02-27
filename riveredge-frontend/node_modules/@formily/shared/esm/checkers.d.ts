export declare const getType: (obj: any) => any;
export declare const isFn: (val: any) => val is Function;
export declare const isArr: (arg: any) => arg is any[];
export declare const isPlainObj: (obj: unknown) => obj is object;
export declare const isStr: (obj: unknown) => obj is string;
export declare const isBool: (obj: unknown) => obj is boolean;
export declare const isNum: (obj: unknown) => obj is number;
export declare const isMap: (val: any) => val is Map<any, any>;
export declare const isSet: (val: any) => val is Set<any>;
export declare const isWeakMap: (val: any) => val is WeakMap<any, any>;
export declare const isWeakSet: (val: any) => val is WeakSet<any>;
export declare const isNumberLike: (index: any) => index is number;
export declare const isObj: (val: unknown) => val is object;
export declare const isRegExp: (obj: unknown) => obj is RegExp;
export declare const isReactElement: (obj: any) => boolean;
export declare const isHTMLElement: (target: any) => target is EventTarget;
export declare type Subscriber<S> = (payload: S) => void;
export interface Subscription<S> {
    notify?: (payload: S) => void | boolean;
    filter?: (payload: S) => any;
}
