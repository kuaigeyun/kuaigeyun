import type { ReactNode, FC } from 'react';

export interface IMenuOption {
  id?: string | number;
  text?: string;
  subtext?: string;
  handler?: (ev: IMenuOptionClick) => void;
  data?: IMenuOption[];
  css?: string;
  icon?: string;
  type?: string | FC<any>; // @deprecated use `comp` instead. Will be removed in v3.0
  comp?: string | FC<any>;
}

export interface IMenuOptionClick {
  context?: any;
  action: IMenuOption; // @deprecated use `option` instead. Will be removed in v3.0
  option: IMenuOption;
  event?: MouseEvent;
}

export declare const Menu: FC<{
  options?: IMenuOption[];
  left?: number;
  top?: number;
  at?: string;
  parent?: HTMLElement;
  mount?: (callback: () => void) => void;
  context?: any;
  css?: string;
  onClick?: (ev: IMenuOptionClick) => void;
}>;

export declare const MenuBar: FC<{
  css?: string;
  menuCss?: string;
  options?: IMenuOption[];
  onClick?: (ev: IMenuOptionClick) => void;
}>;

export declare const DropDownMenu: FC<{
  options?: IMenuOption[];
  at?: string;
  css?: string;
  children?: ReactNode;
  onClick?: (ev: IMenuOptionClick) => void;
}>;

export declare const ContextMenu: FC<{
  options?: IMenuOption[];
  at?: string;
  resolver?: (item: any, event: MouseEvent) => any;
  dataKey?: string;
  filter?: (option: IMenuOption, item: any) => boolean;
  css?: string;
  children?: ReactNode;
  onClick?: (ev: IMenuOptionClick) => void;
}>;

export declare const ActionMenu: FC<{
  options?: IMenuOption[];
  at?: string;
  resolver?: (item: any, event: MouseEvent) => any;
  dataKey?: string;
  filter?: (option: IMenuOption, item: any) => boolean;
  css?: string;
  children?: ReactNode;
  onClick?: (ev: IMenuOptionClick) => void;
}>;

export declare function registerMenuItem(
  type: string,
  handler: FC<{ option?: any }>,
): void;
