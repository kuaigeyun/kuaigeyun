import type { ReactNode, FC } from 'react';
import type { IToolbarItem } from '@svar-ui/react-toolbar';

export declare const Editor: FC<{
  values?: Record<string, any>;
  items?: {
    comp?: string | FC<any>;
    key?: string;
    label?: string;
    labelTemplate?: (value: any) => string;
    column?: 'right' | 'left';
    batch?: string | number;
    hidden?: boolean;
    section?: string;
    sectionMode?: 'accordion' | 'exclusive';
    activeSection?: boolean;
    options?: {
      id?: string | number;
      label?: string;
      [key: string]: any;
    }[];
    required?: boolean;
    validation?: (value: any) => boolean;
    validationMessage?: string;
    config?: {
      [key: string]: any;
    };
    [key: string]: any;
  }[];
  css?: string;
  activeBatch?: string | number;
  topBar?: boolean | { items: IToolbarItem[] };
  bottomBar?: boolean | { items: IToolbarItem[] };
  autoSave?: boolean;
  layout?: 'default' | 'columns';
  placement?: 'inline' | 'sidebar' | 'modal';
  readonly?: boolean;
  focus?: boolean;
  onChange?: (ev: {
    key: string;
    value: any;
    update: Record<string, any>;
    input?: boolean;
  }) => void;
  onSave?: (ev: {
    changes: Record<string, any>;
    values: Record<string, any>;
  }) => void;
  onAction?: (ev: {
    item: IToolbarItem;
    values: Record<string, any>;
    changes: Record<string, any>;
  }) => void;
  onValidation?: (ev: {
    errors: {
      [key: string]: {
        errorType: 'validation' | 'required';
      };
    };
    values: Record<string, any>;
  }) => void;
  children?: ReactNode;
}>;

export declare function registerEditorItem(
  type: string,
  handler: FC<any>,
): void;

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
