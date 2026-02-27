export type { TinyLineConfig } from './line';
export type { TinyAreaConfig } from './area';
export type { TinyColumnConfig } from './column';
export type { TinyProgressConfig } from './progress';
export type { TinyRingConfig } from './ring';
export declare const Tiny: {
    readonly Line: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<import("./line").TinyLineConfig> & import("react").RefAttributes<import("../..").Chart>>;
    readonly Area: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<import("./area").TinyAreaConfig> & import("react").RefAttributes<import("../..").Chart>>;
    readonly Column: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<import("./column").TinyColumnConfig> & import("react").RefAttributes<import("../..").Chart>>;
    readonly Progress: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<import("./progress").TinyProgressConfig> & import("react").RefAttributes<import("../..").Chart>>;
    readonly Ring: import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<import("./ring").TinyRingConfig> & import("react").RefAttributes<import("../..").Chart>>;
};
