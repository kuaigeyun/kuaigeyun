import { PluginRegistry, UIOptions } from '@pdfme/common';
export declare const I18nContext: import("react").Context<(key: keyof import("@pdfme/common").Dict, dict?: import("@pdfme/common").Dict) => string>;
export declare const FontContext: import("react").Context<Record<string, {
    data: string | ArrayBuffer | Uint8Array<ArrayBuffer>;
    fallback?: boolean | undefined;
    subset?: boolean | undefined;
}>>;
export declare const PluginsRegistry: import("react").Context<PluginRegistry>;
export declare const OptionsContext: import("react").Context<UIOptions>;
export declare const CacheContext: import("react").Context<Map<string | number, unknown>>;
