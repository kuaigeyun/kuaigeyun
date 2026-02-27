type FormStore = {
    schema?: any;
    flattenSchema: any;
    context?: any;
    initialized: boolean;
    init?: (schema: FormStore['schema']) => any;
    setContext: (context: any) => any;
};
export declare const createStore: () => import("zustand").StoreApi<FormStore>;
export {};
