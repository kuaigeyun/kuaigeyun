import type { ReactNode, FC } from 'react';

export interface IUser {
  id: string | number;
  name?: string;
  avatar?: string;
  color?: string;
}

export interface IComment {
  id?: string | number;
  content: string;
  author?: IUser;
  user?: string | number;
  date?: Date;
  format?: 'text' | 'markdown' | FormatComponent;
}

export interface IChange {
  action: 'add' | 'update' | 'delete';
  id?: string | number;
  comment?: IComment;
  value: IComment[];
  originalValue: IComment[] | string | number;
}

export type FormatComponent = FC<{
  content: string;
}>;

export type RenderComponent = FC<{
  owned?: string | number;
  edit?: string | number;
  author: IUser;
  date: Date;
}>;

export declare const Comments: FC<{
  onData?: (value: string | number) => Promise<IComment[]> | IComment[];
  onChange?: (ev: IChange) => void;
  value?: IComment[] | string | number;
  readonly?: boolean;
  render?: 'bubbles' | 'flow' | RenderComponent;
  format?: 'text' | 'markdown' | FormatComponent;
  users?: IUser[];
  activeUser?: string | number | IUser;
  focus?: boolean;
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
