export declare const isExpression: (str: string) => boolean;
export declare const isHasExpression: (schema: any) => boolean;
export declare const parseExpression: (func: any, formData: {}, parentPath: string | [
]) => any;
export declare function getRealDataPath(path: any): string;
export declare function getValueByPath(formData: any, path: any): any;
export declare const parseAllExpression: (_schema: any, _formData: any, dataPath: string, formSchema?: any) => any;
