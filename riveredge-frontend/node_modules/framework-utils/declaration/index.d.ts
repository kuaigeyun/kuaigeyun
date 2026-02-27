export declare function prefixNames(prefix: string, ...classNames: string[]): string;
export declare function prefixCSS(prefix: string, css: string): string;
export declare function ref(target: any, name: string): (e: any) => void;
export declare function refs(target: any, name: string, i: number): (e: any) => void;
export declare function Properties(properties: any[], action: (prototype: any, property: string) => any): (component: any) => void;
export declare function withMethods(methods: readonly string[], duplicate?: {
    [name: string]: string;
}): (prototype: any, propertyName: string) => void;
export declare type ParametersType<Func, Return> = Func extends (...params: infer Params) => any ? (...params: Params) => Return : never;
export declare type ExcludeInterface<Obj1, Obj2> = {
    [key in Exclude<keyof Obj1, keyof Obj2>]: Obj1[key];
};
export declare type EntriesObject<T> = {
    [key in keyof T]: [key, Readonly<T[key]>];
};
export declare type FindKey<E, V> = E extends [infer U, V] ? U & string : never;
export declare type InvertObject<T extends Record<string, any>, En extends Record<string, any> = EntriesObject<T>> = {
    [key in En[keyof En][1]]: FindKey<En[keyof En], key>;
};
export declare type Entries<Obj extends {
    [key: string]: any;
}, Key = keyof Obj> = Key extends string ? [Key, Obj[Key]] : never;
export declare type ReverseKey<Key extends string, Obj extends {
    [key: string]: any;
}, E = Entries<Obj>> = E extends [infer Value, Key] ? Value : never;
export declare type UniqueMethodInterface<Methods, Target extends Methods, ReturnTarget extends any, Duplicate extends {
    [key: string]: any;
}> = {
    [key in keyof ExcludeInterface<Methods, Duplicate>]: Methods[key] extends (...params: any[]) => Target ? ParametersType<Methods[key], ReturnTarget> : Methods[key];
};
export declare type ChangedMethodInterface<Methods, Target extends Methods, ReturnTarget extends any, Duplicate extends {
    [key: string]: any;
}> = {
    [key in Duplicate[keyof Duplicate]]: Methods[ReverseKey<key, Duplicate> & keyof Methods] extends (...params: any[]) => Target ? ParametersType<Methods[ReverseKey<key, Duplicate> & keyof Methods], ReturnTarget> : Methods[ReverseKey<key, Duplicate> & keyof Methods];
};
export declare type MethodInterface<Methods, Target extends Methods, ReturnTarget extends any, Duplicate extends {
    [key: string]: any;
} = {}> = UniqueMethodInterface<Methods, Target, ReturnTarget, Duplicate> & ChangedMethodInterface<Methods, Target, ReturnTarget, Duplicate>;
