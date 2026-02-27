import type { FC, ReactNode } from 'react';

import type {
  IFilterSet,
  TSingleOptions,
  TFilterType,
  IApi,
  TMethodsConfig,
  TType,
  TPredicate,
  AnyData,
  IFilter,
  IFilterBarField,
  IConfig,
} from '@svar-ui/filter-store';

export * from '@svar-ui/filter-store';

export declare const FilterBuilder: FC<
  {
    type?: 'list' | 'line' | 'simple';
    init?: (api: IApi) => void;
  } & IConfig &
    FilterBuilderActions<TMethodsConfig>
>;

export declare const FilterEditor: FC<{
  fields?: IConfig['fields'];
  fieldsSelector?: boolean;
  field?: string;
  buttons?: boolean;
  options?: TSingleOptions;
  includes?: AnyData[];
  type?: TType;
  filter?: TFilterType;
  value?: AnyData | { start?: Date; end: Date };
  format?: string | ((value: AnyData) => string);
  predicate?: TPredicate;
  onApply?: (ev: { value: IFilter }) => void;
  onCancel?: (ev: { value: IFilter }) => void;
  onChange?: (ev: { value: IFilter }) => void;
}>;

export declare const FilterBar: FC<{
  fields: (
    | string
    | IFilterBarField
    | {
        type: 'all' | 'dynamic';
        by: (string | IFilterBarField)[];
        label?: string;
        placeholder?: string;
      }
  )[];
  debounce?: number;
  onChange?: (ev: { value: IFilterSet }) => void;
}>;

export declare const Willow: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const WillowDark: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const Material: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

/* get component events from store actions*/
type RemoveHyphen<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}${RemoveHyphen<Tail>}`
  : S;

type EventName<K extends string> = `on${RemoveHyphen<K>}`;

export type FilterBuilderActions<TMethodsConfig extends Record<string, any>> = {
  [K in keyof TMethodsConfig as EventName<K & string>]?: (
    ev: TMethodsConfig[K],
  ) => void;
} & {
  [key: `on${string}`]: (ev?: any) => void;
};
