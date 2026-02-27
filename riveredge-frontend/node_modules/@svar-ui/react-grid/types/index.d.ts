import type { FC, ComponentProps, ReactNode } from 'react';
import { ContextMenu as BaseContextMenu } from '@svar-ui/react-menu';
import { Toolbar as BaseToolbar } from '@svar-ui/react-toolbar';

import type {
  IColumn,
  IRow,
  IApi,
  ISizeConfig,
  TMethodsConfig,
  IConfig,
  TEditorType,
  IColumnEditor,
  IHeaderCell,
} from '@svar-ui/grid-store';

export * from '@svar-ui/grid-store';

export interface IColumnEditorConfig extends IColumnEditor {
  config?: IColumnEditor['config'] & {
    cell?: FC<{
      data: any;
      onaction: (ev: { action?: any; data?: { [key: string]: any } }) => void;
    }>;
  };
}

export type TEditorHandlerConfig = (
  row?: IRow,
  column?: IColumn,
) => TEditorType | IColumnEditorConfig | null;

export interface ICellProps {
  api: IApi;
  row: IRow;
  column: IColumn;
  onaction: (ev: { action?: any; data?: { [key: string]: any } }) => void;
}

export interface IHeaderCellConfig extends IHeaderCell {
  cell?: FC<
    ICellProps & {
      cell: Omit<IHeaderCell, 'cell'>;
    }
  >;
}

export type TColumnHeaderConfig =
  | string
  | IHeaderCellConfig
  | (string | IHeaderCellConfig)[];

export interface IColumnConfig
  extends Omit<
    IColumn,
    'left' | 'right' | 'fixed' | 'optionsMap' | 'header' | 'footer'
  > {
  cell?: FC<ICellProps>;
  editor?: TEditorType | IColumnEditorConfig | TEditorHandlerConfig;
  header?: TColumnHeaderConfig;
  footer?: TColumnHeaderConfig;
}

export declare const Grid: FC<
  {
    rowStyle?: (row: any) => string;
    columnStyle?: (column: IColumn) => string;
    cellStyle?: (row: any, column: IColumn) => string;
    multiselect?: boolean;
    autoConfig?: boolean | IColumnConfig;
    header?: boolean;
    footer?: boolean;
    reorder?: boolean;
    autoRowHeight?: boolean;
    responsive?: {
      [key: string]: {
        sizes?: ISizeConfig;
        columns?: IColumnConfig[];
      };
    };
    init?: (api: IApi) => void;

    overlay?: string | FC;
    columns: IColumnConfig[];
    hotkeys?:
      | false
      | { [key: string]: ((e?: KeyboardEvent) => void) | boolean };
  } & IConfig &
    GridActions<TMethodsConfig>
>;

export declare const HeaderMenu: FC<{
  columns?: { [key: string]: boolean };
  api?: IApi;
  children?: ReactNode;
}>;

export declare const ContextMenu: FC<
  ComponentProps<typeof BaseContextMenu> & {
    api?: IApi;
  }
>;

export declare const Toolbar: FC<
  ComponentProps<typeof BaseToolbar> & {
    api?: IApi;
  }
>;

export declare const Tooltip: FC<{
  content?: FC;
  api?: IApi;
  children?: ReactNode;
}>;

export declare const Material: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const Willow: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const WillowDark: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

/* get component events from store actions*/
type RemoveHyphen<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}${RemoveHyphen<Tail>}`
  : S;

type EventName<K extends string> = `on${RemoveHyphen<K>}`;

export type GridActions<TMethodsConfig extends Record<string, any>> = {
  [K in keyof TMethodsConfig as EventName<K & string>]?: (
    ev: TMethodsConfig[K],
  ) => void;
} & {
  [key: `on${string}`]: (ev?: any) => void;
};
