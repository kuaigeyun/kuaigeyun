import type { ReactNode, FC } from 'react';

export declare const TextArea: FC<{
  value?: string;
  id?: string | number;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  error?: boolean;
  readonly?: boolean;
  onChange?: (ev: { value: string; input?: boolean }) => void;
}>;

export declare const Button: FC<{
  type?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'link'
    | 'primary block'
    | 'secondary block'
    | 'danger block'
    | 'link block';
  css?: string;
  icon?: string;
  disabled?: boolean;
  title?: string;
  text?: string;
  children?: ReactNode;
  onClick?: (ev: MouseEvent) => void;
}>;

export declare const Checkbox: FC<{
  id?: string | number;
  label?: string;
  inputValue?: string | number;
  value?: boolean;
  style?: string;
  disabled?: boolean;
  onChange?: (ev: { value: boolean; inputValue: string | number }) => void;
}>;

export declare const CheckboxGroup: FC<{
  options?: { id: string | number; label: string }[];
  value?: (string | number)[];
  type?: 'inline' | 'grid';
  onChange?: (ev: { value: (string | number)[] }) => void;
}>;

export declare const ColorSelect: FC<{
  colors?: string[];
  value?: string;
  id?: string | number;
  clear?: boolean;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  error?: boolean;
  onChange?: (ev: { value: string }) => void;
}>;

export declare const ColorBoard: FC<{
  value?: string;
  button?: boolean;
  onChange?: (ev: { value: string; input?: boolean }) => void;
}>;

export declare const ColorPicker: FC<{
  value?: string;
  id?: string | number;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  error?: boolean;
  clear?: boolean;
  onChange?: (ev: { value: string }) => void;
}>;

export declare const Combo: FC<{
  value?: string | number;
  id?: string | number;
  options?: { id: string | number; label: string }[];
  textOptions?: { id: string | number; label: string }[];
  textField?: string;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  error?: boolean;
  clear?: boolean;
  children?: ReactNode;
  onChange?: (ev: { value: string | number }) => void;
}>;

export declare const DatePicker: FC<{
  value?: Date;
  id?: string | number;
  disabled?: boolean;
  error?: boolean;
  width?: string;
  align?: 'start' | 'center' | 'end';
  placeholder?: string;
  format?: string | ((value: Date) => string);
  buttons?: boolean | ('clear' | 'today')[];
  css?: string;
  title?: string;
  editable?: boolean | ((value: string) => Date | null);
  clear?: boolean;
  onChange?: (ev: { value: Date | null }) => void;
}>;

export declare const DateRangePicker: FC<{
  value?: { start: Date; end?: Date };
  id?: string | number;
  disabled?: boolean;
  error?: boolean;
  width?: string;
  align?: 'start' | 'center' | 'end';
  placeholder?: string;
  css?: string;
  title?: string;
  format?: string | ((date: Date) => string);
  months?: 1 | 2;
  buttons?: boolean | ('clear' | 'today' | 'done')[];
  editable?: boolean | ((value: string) => Date | null);
  clear?: boolean;
  onChange?: (ev: { value: { start: Date; end: Date | null } | null }) => void;
}>;

export declare const Icon: FC<{
  css?: string;
  title?: string;
  children?: ReactNode;
  onClick?: (ev: MouseEvent) => void;
}>;

export declare const MultiCombo: FC<{
  id?: string | number;
  value?: (string | number)[];
  options?: { id: string | number; label: string }[];
  textOptions?: { id: string | number; label: string }[];
  textField?: string;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  error?: boolean;
  checkboxes?: boolean;
  children?: ReactNode;
  onChange?: (ev: { value: (string | number)[] }) => void;
}>;

export declare const Popup: FC<{
  left?: number;
  top?: number;
  at?: string;
  parent?: HTMLElement;
  mount?: any;
  children?: ReactNode;
  onCancel?: (ev: MouseEvent) => void;
}>;

export declare const Dropdown: FC<{
  position?: string;
  align?: 'start' | 'center' | 'end';
  autoFit?: boolean;
  width?: string;
  children?: ReactNode;
  onCancel?: (ev: MouseEvent) => void;
}>;

export declare const Pager: FC<{
  total?: number;
  pageSize?: number;
  value?: number;
  onChange?: (ev: { value: number; from: number; to: number }) => void;
}>;

export declare const RadioButton: FC<{
  id?: string | number;
  label?: string;
  value?: boolean;
  name?: string;
  inputValue?: string | number;
  disabled?: boolean;
  onChange?: (ev: { value: boolean; inputValue: string | number }) => void;
}>;

export declare const RadioButtonGroup: FC<{
  options?: { id: string | number; label: string }[];
  value?: string | number;
  type?: 'inline' | 'grid';
  onChange?: (ev: { value: string | number }) => void;
}>;

export declare const RichSelect: FC<{
  value?: string | number;
  options?: { id: string | number; label: string }[];
  textOptions?: { id: string | number; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  title?: string;
  textField?: string;
  clear?: boolean;
  children?: ReactNode;
  onChange?: (ev: { value: string | number }) => void;
}>;

export declare const Segmented: FC<{
  options?: {
    id: string | number;
    label: string;
    icon?: string;
    title?: string;
  }[];
  value?: string | number;
  css?: string;
  children?: ReactNode;
  onChange?: (ev: { value: string | number }) => void;
}>;

export declare const Select: FC<{
  value?: string | number;
  options?: { id: string | number; label: string }[];
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  error?: boolean;
  textField?: string;
  clear?: boolean;
  id?: string | number;
  onChange?: (ev: { value: string | number }) => void;
}>;

export declare const Slider: FC<{
  id?: string | number;
  label?: string;
  width?: string;
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  title?: string;
  disabled?: boolean;
  onChange?: (ev: { value: number; previous: number; input?: boolean }) => void;
}>;

export declare const Switch: FC<{
  id?: string | number;
  value?: boolean;
  disabled?: boolean;
  onChange?: (ev: { value: boolean }) => void;
}>;

export declare const Tabs: FC<{
  options?: {
    id: string | number;
    label?: string;
    title?: string;
    icon?: string;
  }[];
  value?: string | number;
  type?: 'top' | 'bottom';
  onChange?: (ev: { value: string | number }) => void;
}>;

export declare const Text: FC<{
  value?: string | number;
  id?: string | number;
  readonly?: boolean;
  focus?: boolean;
  select?: boolean;
  type?: 'text' | 'number' | 'password';
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  inputStyle?: string;
  title?: string;
  css?: string;
  icon?: string;
  clear?: boolean;
  onChange?: (ev: { value: string | number; input?: boolean }) => void;
}>;

export declare const Counter: FC<{
  id?: string | number;
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  error?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  onChange?: (ev: { value: number; input?: boolean }) => void;
}>;

export declare const Field: FC<{
  label?: string;
  position?: 'left';
  width?: string;
  error?: boolean;
  type?: 'checkbox' | 'slider' | 'switch';
  required?: boolean;
  children?: ReactNode;
}>;

export declare const Calendar: FC<{
  value?: Date;
  current?: Date;
  markers?: (date: Date) => string;
  buttons?: boolean | ('clear' | 'today')[];
  onChange?: (ev: { value: Date | null }) => void;
}>;

export declare const Month: FC<{
  value?: { start: Date; end: Date } | Date;
  current?: Date;
  part?: string;
  markers?: (date: Date) => string;
  onCancel?: () => void;
  onChange?: (ev: Date) => void;
}>;

export declare const RangeCalendar: FC<{
  start?: Date;
  end?: Date;
  current?: Date;
  months?: 1 | 2;
  markers?: (date: Date) => string;
  buttons?: boolean | ('clear' | 'today' | 'done')[];
  onChange?: (ev: { start: Date | null; end: Date | null }) => void;
}>;

export declare const TimePicker: FC<{
  value?: Date;
  id?: string | number;
  title?: string;
  css?: string;
  disabled?: boolean;
  error?: boolean;
  format?: string | ((value: Date) => string);
  onChange?: (ev: { value: Date }) => void;
}>;

export declare const TwoState: FC<{
  value?: boolean;
  type?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'link'
    | 'primary block'
    | 'secondary block'
    | 'danger block'
    | 'link block';
  icon?: string;
  disabled?: boolean;
  iconActive?: string;
  title?: string;
  css?: string;
  text?: string;
  textActive?: string;
  active?: ReactNode;
  children?: ReactNode;
  onClick?: (ev: MouseEvent) => void;
  onChange?: (ev: { value: boolean }) => void;
}>;

export declare const Modal: FC<{
  title?: string;
  buttons?: boolean | string[];
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  onConfirm?: (ev: { button?: string; event: MouseEvent }) => void;
  onCancel?: (ev: { button?: string; event: MouseEvent }) => void;
}>;

export declare const ModalArea: FC<{
  children?: ReactNode;
}>;

export declare const SideArea: FC<{
  position?: 'right';
  children?: ReactNode;
  onCancel?: () => void;
}>;

export declare const Portal: FC<{
  theme?: 'willow' | 'willow-dark';
  target?: HTMLElement;
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

export declare const Locale: FC<{
  words?: any;
  optional?: boolean;
  children?: ReactNode;
}>;

export declare const Globals: FC<{
  children?: ReactNode;
}>;

export declare const SuggestDropdown: FC<{
  items?: { id: string | number; label: string }[];
  children?: ReactNode;
  onSelect?: (ev: { id: string | number }) => void;
  onReady?: (ev: {
    navigate?: (dir: number | null, ev?: KeyboardEvent) => void;
    keydown?: (ev: KeyboardEvent, dir: number) => void;
    move?: (ev: KeyboardEvent) => void;
  }) => void;
}>;

export type { ILocale, Terms } from '@svar-ui/lib-dom';

export declare function popupContainer(node: HTMLElement): void;
