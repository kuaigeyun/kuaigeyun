export interface MaskConfig {
    enabled?: boolean;
    blur?: boolean;
}
export type MaskType = MaskConfig | boolean;
export declare const useMergedMask: (mask?: MaskType, contextMask?: MaskType, prefixCls?: string) => [boolean, {
    [key: string]: string | undefined;
}];
