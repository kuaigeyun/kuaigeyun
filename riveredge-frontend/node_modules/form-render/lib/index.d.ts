/// <reference types="react" />
export * from './widgets';
export { mapping } from './models/mapping';
export { default as useForm } from './models/useForm';
export { default as connectForm } from './form-core/connectForm';
export { default as SearchForm } from './derivative/SearchForm';
export { default as FormSlimRender } from './derivative/SlimRender';
export type { default as FR, Schema, FRProps, FormInstance, FormParams, FieldParams, WatchProperties, SchemaType, SchemaBase, ValidateParams, ResetParams, RuleItem, WidgetProps, } from './type';
declare const _default: import("react").ComponentType<import("./type").FRProps>;
export default _default;
