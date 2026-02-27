/**
 * @template T
 */
export class $Schema<T> {
    /**
     * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
     * Schema. Validate will check the structure of the parameter and return true iff the instance
     * really is an instance of Schema.
     *
     * @param {T} o
     * @return {boolean}
     */
    validate(o: T): boolean;
    /**
     * Similar to validate, but this method accepts untyped parameters.
     *
     * @param {any} _o
     * @return {_o is T}
     */
    check(_o: any): _o is T;
    /**
     * @type {$Schema<T?>}
     */
    get nullable(): $Schema<T | null>;
    /**
     * @type {$Optional<$Schema<T>>}
     */
    get optional(): $Optional<$Schema<T>>;
    /**
     * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
     * Use this if you know that the type is of a specific type and you just want to convince the type
     * system.
     *
     * **Do not rely on these error messages!**
     * Performs an assertion check only if not in a production environment.
     *
     * @param {any} o
     * @return {o extends T ? T : never}
     */
    cast(o: any): any extends T ? T : never;
    /**
     * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
     * Use this if you know that the type is of a specific type and you just want to convince the type
     * system.
     *
     * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).ensure((n) => n + 1)`
     *
     * **Do not rely on these error messages!**
     * Performs an assertion check if not in a production environment.
     *
     * @param {T} o
     * @return {o extends T ? T : never}
     */
    ensure(o: T): T extends T ? T : never;
    get [schemaSymbol](): boolean;
}
/**
 * @template {(new (...args:any[]) => any) | ((...args:any[]) => any)} C
 * @extends {$Schema<C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)>}
 */
export class $ConstructedBy<C extends (new (...args: any[]) => any) | ((...args: any[]) => any)> extends $Schema<C extends (...args: any[]) => infer T ? T : C extends new (...args: any[]) => any ? InstanceType<C> : never> {
    /**
     * @param {C} c
     */
    constructor(c: C);
    v: C;
    /**
     * @param {any} o
     * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
     */
    check(o: any): o is C extends ((...args: any[]) => infer T_1) ? T_1 : (C extends (new (...args: any[]) => any) ? InstanceType<C> : never);
}
export function constructedBy<C extends (new (...args: any[]) => any) | ((...args: any[]) => any)>(c: C): CastToSchema<$ConstructedBy<C>>;
/**
 * @template {LiteralType} T
 * @extends {$Schema<T>}
 */
export class $Literal<T extends LiteralType> extends $Schema<T> {
    /**
     * @param {Array<T>} literals
     */
    constructor(literals: Array<T>);
    v: T[];
}
export function literal<T extends LiteralType[]>(...literals: T): CastToSchema<$Literal<T[number]>>;
/**
 * @template {{ [key: string|symbol|number]: $Schema<any> }} S
 * @typedef {{ [Key in keyof S as S[Key] extends $Optional<$Schema<any>> ? Key : never]?: S[Key] extends $Optional<$Schema<infer Type>> ? Type : never } & { [Key in keyof S as S[Key] extends $Optional<$Schema<any>> ? never : Key]: S[Key] extends $Schema<infer Type> ? Type : never }} $ObjectToType
 */
/**
 * @template {{[key:string|symbol|number]: $Schema<any>}} S
 * @extends {$Schema<$ObjectToType<S>>}
 */
export class $Object<S extends {
    [key: string | symbol | number]: $Schema<any>;
}> extends $Schema<$ObjectToType<S>> {
    /**
     * @param {S} v
     */
    constructor(v: S);
    v: S;
}
export function object<S extends {
    [key: string | symbol | number]: $Schema<any>;
}>(def: S): $Schema<{ [Key in keyof S as S[Key] extends $Optional<$Schema<any>> ? Key : never]?: S[Key] extends $Optional<$Schema<infer Type>> ? Type : never; } & { [Key in keyof S as S[Key] extends $Optional<$Schema<any>> ? never : Key]: S[Key] extends $Schema<infer Type> ? Type : never; }>;
/**
 * @template {$Schema<string|number|symbol>} Keys
 * @template {$Schema<any>} Values
 * @extends {$Schema<Record<Keys extends $Schema<infer K> ? K : never,Values extends $Schema<infer T> ? T : never>>}
 */
export class $Record<Keys extends $Schema<string | number | symbol>, Values extends $Schema<any>> extends $Schema<Record<Keys extends $Schema<infer K> ? K : never, Values extends $Schema<infer T> ? T : never>> {
    /**
     * @param {Keys} keys
     * @param {Values} values
     */
    constructor(keys: Keys, values: Values);
    keys: Keys;
    values: Values;
    /**
     * @param {any} o
     * @return {o is Record<Keys extends $Schema<infer K> ? K : never,Values extends $Schema<infer T> ? T : never>}
     */
    check(o: any): o is Record<Keys extends $Schema<infer K_1> ? K_1 : never, Values extends $Schema<infer T_1> ? T_1 : never>;
}
export function record<Keys extends $Schema<string | number | symbol>, Values extends $Schema<any>>(keys: Keys, values: Values): CastToSchema<$Record<Keys, Values>>;
/**
 * @template {$Schema<any>[]} S
 * @extends {$Schema<{ [Key in keyof S]: S[Key] extends $Schema<infer Type> ? Type : never }>}
 */
export class $Tuple<S extends $Schema<any>[]> extends $Schema<{ [Key in keyof S]: S[Key] extends $Schema<infer Type> ? Type : never; }> {
    /**
     * @param {S} v
     */
    constructor(v: S);
    v: S;
    /**
     * @param {any} o
     * @return {o is { [K in keyof S]: S[K] extends $Schema<infer Type> ? Type : never }}
     */
    check(o: any): o is { [K in keyof S]: S[K] extends $Schema<infer Type_1> ? Type_1 : never; };
}
export function tuple<T extends Array<$Schema<any>>>(...def: T): CastToSchema<$Tuple<T>>;
/**
 * @template {$Schema<any>} S
 * @extends {$Schema<Array<S extends $Schema<infer T> ? T : never>>}
 */
export class $Array<S extends $Schema<any>> extends $Schema<(S extends $Schema<infer T> ? T : never)[]> {
    /**
     * @param {Array<S>} v
     */
    constructor(v: Array<S>);
    /**
     * @type {$Schema<S extends $Schema<infer T> ? T : never>}
     */
    v: $Schema<S extends $Schema<infer T_1> ? T_1 : never>;
    /**
     * @param {any} o
     * @return {o is Array<S extends $Schema<infer T> ? T : never>} o
     */
    check(o: any): o is Array<S extends $Schema<infer T_1> ? T_1 : never>;
}
export function array<T extends Array<$Schema<any>>>(...def: T): $Schema<Array<T extends Array<$Schema<infer S>> ? S : never>>;
/**
 * @template T
 * @extends {$Schema<T>}
 */
export class $InstanceOf<T> extends $Schema<T> {
    /**
     * @param {new (...args:any) => T} constructor
     */
    constructor(constructor: new (...args: any) => T);
    v: new (...args: any) => T;
}
export function instance<T>(c: new (...args: any) => T): $Schema<T>;
/**
 * @template {$Schema<any>[]} Args
 * @typedef {(...args:UnwrapArray<TuplePop<Args>>)=>Unwrap<TupleLast<Args>>} _LArgsToLambdaDef
 */
/**
 * @template {Array<$Schema<any>>} Args
 * @extends {$Schema<_LArgsToLambdaDef<Args>>}
 */
export class $Lambda<Args extends Array<$Schema<any>>> extends $Schema<_LArgsToLambdaDef<Args>> {
    /**
     * @param {Args} args
     */
    constructor(args: Args);
    len: number;
    args: $Schema<any[]>;
    res: $Schema<any>;
}
export function lambda<Args extends $Schema<any>[]>(...args: Args): $Schema<(...args: UnwrapArray<TuplePop<Args>>) => Unwrap<TupleLast<Args>>>;
/**
 * @template {Array<$Schema<any>>} T
 * @extends {$Schema<Intersect<UnwrapArray<T>>>}
 */
export class $Intersection<T extends Array<$Schema<any>>> extends $Schema<Intersect<UnwrapArray<T>>> {
    /**
     * @param {T} v
     */
    constructor(v: T);
    /**
     * @type {T}
     */
    v: T;
}
export function intersect<T extends $Schema<any>[]>(...def: T): CastToSchema<$Intersection<T>>;
/**
 * @template S
 * @extends {$Schema<S>}
 */
export class $Union<S> extends $Schema<S> {
    static schema: $Schema<$Union<unknown>>;
    /**
     * @param {Array<$Schema<S>>} v
     */
    constructor(v: Array<$Schema<S>>);
    v: $Schema<S>[];
}
export function union<T extends Array<$Schema<any>>>(...def: T): CastToSchema<$Union<T extends [] ? never : (T extends Array<$Schema<infer S>> ? S : never)>>;
/**
 * @type {$Schema<any>}
 */
export const any: $Schema<any>;
/**
 * @type {$Schema<bigint>}
 */
export const bigint: $Schema<bigint>;
/**
 * @type {$Schema<Symbol>}
 */
export const symbol: $Schema<Symbol>;
/**
 * @type {$Schema<number>}
 */
export const number: $Schema<number>;
/**
 * @type {$Schema<string>}
 */
export const string: $Schema<string>;
export { $undefined as undefined };
/**
 * @type {$Schema<void>}
 */
export const $void: $Schema<void>;
export const $null: $Schema<null>;
/**
 * Assert that a variable is of this specific type.
 * The assertion check is only performed in non-production environments.
 *
 * @type {<T>(o:any,schema:$Schema<T>) => asserts o is T}
 */
export const assert: <T>(o: any, schema: $Schema<T>) => asserts o is T;
export type LiteralType = string | number | bigint | boolean | null | undefined;
export type AnyObject = {
    [k: string | number | symbol]: any;
};
export type Unwrap<T> = T extends $Schema<infer X> ? X : T;
export type UnwrapArray<T extends readonly unknown[]> = T extends readonly [$Schema<infer First>, ...infer Rest] ? [First, ...UnwrapArray<Rest>] : [];
export type CastToSchema<T> = T extends $Schema<infer S> ? $Schema<S> : never;
export type TupleLast<Arr extends unknown[]> = Arr extends [...unknown[], infer L] ? L : never;
export type TuplePop<Arr extends unknown[]> = Arr extends [...infer Fs, unknown] ? Fs : never;
export type Intersect<T extends readonly unknown[]> = T extends [] ? {} : T extends [infer First] ? First : T extends [infer First, ...infer Rest] ? First & Intersect<Rest> : never;
export type $ObjectToType<S extends {
    [key: string | symbol | number]: $Schema<any>;
}> = { [Key in keyof S as S[Key] extends $Optional<$Schema<any>> ? Key : never]?: S[Key] extends $Optional<$Schema<infer Type>> ? Type : never; } & { [Key in keyof S as S[Key] extends $Optional<$Schema<any>> ? never : Key]: S[Key] extends $Schema<infer Type> ? Type : never; };
export type _LArgsToLambdaDef<Args extends $Schema<any>[]> = (...args: UnwrapArray<TuplePop<Args>>) => Unwrap<TupleLast<Args>>;
/**
 * @template {$Schema<any>} S
 * @extends $Schema<Unwrap<S>|undefined>
 */
declare class $Optional<S extends $Schema<any>> extends $Schema<Unwrap<S> | undefined> {
    /**
     * @param {S} s
     */
    constructor(s: S);
    s: S;
    get [isOptionalSymbol](): boolean;
}
/**
 * @typedef {string|number|bigint|boolean|null|undefined} LiteralType
 */
/**
 * @typedef {{ [k:string|number|symbol]: any }} AnyObject
 */
/**
 * @template T
 * @typedef {T extends $Schema<infer X> ? X : T} Unwrap
 */
/**
 * @template {readonly unknown[]} T
 * @typedef {T extends readonly [$Schema<infer First>, ...infer Rest] ? [First, ...UnwrapArray<Rest>] : [] } UnwrapArray
 */
/**
 * @template T
 * @typedef {T extends $Schema<infer S> ? $Schema<S> : never} CastToSchema
 */
/**
 * @template {unknown[]} Arr
 * @typedef {Arr extends [...unknown[], infer L] ? L : never} TupleLast
 */
/**
 * @template {unknown[]} Arr
 * @typedef {Arr extends [...infer Fs, unknown] ? Fs : never} TuplePop
 */
/**
 * @template {readonly unknown[]} T
 * @typedef {T extends []
 *   ? {}
 *   : T extends [infer First]
 *   ? First
 *   : T extends [infer First, ...infer Rest]
 *   ? First & Intersect<Rest>
 *   : never
 * } Intersect
 */
declare const schemaSymbol: unique symbol;
/**
 * @type {$Schema<undefined>}
 */
declare const $undefined: $Schema<undefined>;
declare const isOptionalSymbol: unique symbol;
//# sourceMappingURL=schema.d.ts.map