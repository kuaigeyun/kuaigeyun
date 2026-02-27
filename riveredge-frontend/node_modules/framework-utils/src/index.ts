export function prefixNames(prefix: string, ...classNames: string[]) {
    return classNames
        .map((className) =>
            className
                .split(" ")
                .map((name) => (name ? `${prefix}${name}` : ""))
                .join(" ")
        )
        .join(" ");
}

export function prefixCSS(prefix: string, css: string) {
    return css.replace(/([^}{]*){/gm, (_, selector) => {
        return `${selector.replace(/\.([^{,\s\d.]+)/g, `.${prefix}$1`)}{`;
    });
}

/* react */
export function ref(target: any, name: string) {
    return (e: any) => {
        e && (target[name] = e);
    };
}
export function refs(target: any, name: string, i: number) {
    return (e: any) => {
        e && (target[name][i] = e);
    };
}

/* Class Decorator */
export function Properties(
    properties: any[],
    action: (prototype: any, property: string) => any
) {
    return (component: any) => {
        const prototype = component.prototype;

        properties.forEach((property) => {
            action(prototype, property);
        });
    };
}

/* Property Decorator */
export function withMethods(
    methods: readonly string[],
    duplicate: { [name: string]: string } = {}
) {
    return (prototype: any, propertyName: string) => {
        methods.forEach((name) => {
            const methodName = duplicate[name] || name;

            if (methodName in prototype) {
                return;
            }
            prototype[methodName] = function (...args) {
                const result = this[propertyName][name](...args);

                if (result === this[propertyName]) {
                    return this;
                } else {
                    return result;
                }
            };
        });
    };
}

export type ParametersType<Func, Return> = Func extends (
    ...params: infer Params
) => any
    ? (...params: Params) => Return
    : never;

export type ExcludeInterface<Obj1, Obj2> = {
    [key in Exclude<keyof Obj1, keyof Obj2>]: Obj1[key];
};

export type EntriesObject<T> = {
    [key in keyof T]: [key, Readonly<T[key]>];
};
export type FindKey<E, V> = E extends [infer U, V] ? U & string : never;
export type InvertObject<
    T extends Record<string, any>,
    En extends Record<string, any> = EntriesObject<T>
    > = {
        [key in En[keyof En][1]]: FindKey<En[keyof En], key>
    };

export type Entries<
    Obj extends { [key: string]: any },
    Key = keyof Obj
> = Key extends string ? [Key, Obj[Key]] : never;

export type ReverseKey<
    Key extends string,
    Obj extends { [key: string]: any },
    E = Entries<Obj>
> = E extends [infer Value, Key] ? Value : never;

export type UniqueMethodInterface<
    Methods,
    Target extends Methods,
    ReturnTarget extends any,
    Duplicate extends { [key: string]: any }
> = {
    [key in keyof ExcludeInterface<Methods, Duplicate>]: Methods[key] extends (
        ...params: any[]
    ) => Target
        ? ParametersType<Methods[key], ReturnTarget>
        : Methods[key];
};

export type ChangedMethodInterface<
    Methods,
    Target extends Methods,
    ReturnTarget extends any,
    Duplicate extends { [key: string]: any }
> = {
    [key in Duplicate[keyof Duplicate]]: Methods[ReverseKey<key, Duplicate> &
        keyof Methods] extends (...params: any[]) => Target
        ? ParametersType<
              Methods[ReverseKey<key, Duplicate> & keyof Methods],
              ReturnTarget
          >
        : Methods[ReverseKey<key, Duplicate> & keyof Methods];
};

export type MethodInterface<
    Methods,
    Target extends Methods,
    ReturnTarget extends any,
    Duplicate extends { [key: string]: any } = {}
> = UniqueMethodInterface<Methods, Target, ReturnTarget, Duplicate> &
    ChangedMethodInterface<Methods, Target, ReturnTarget, Duplicate>;
