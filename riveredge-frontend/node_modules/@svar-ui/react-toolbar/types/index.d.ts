import type { ReactNode, FC } from 'react';

export interface IToolbarItem {
  id?: string | number;
  comp?: string | FC<any>;
  icon?: string;
  css?: string;
  text?: string;
  menuText?: string;
  key?: string;
  spacer?: boolean;
  collapsed?: boolean;
  handler?: (item: IToolbarItem, value?: any) => void;
  layout?: 'column';
  items?: IToolbarItem[];
  [key: string]: any;
}

export declare const Toolbar: FC<{
  items?: IToolbarItem[];
  menuCss?: string;
  css?: string;
  values?: { [key: string]: any };
  overflow?: 'collapse' | 'wrap' | 'menu';
  onClick?: (ev: { item: IToolbarItem }) => void;
  onChange?: (ev: { value: any; item: IToolbarItem }) => void;
}>;

export declare function registerToolbarItem(
  type: string,
  handler: FC<any>,
): void;
