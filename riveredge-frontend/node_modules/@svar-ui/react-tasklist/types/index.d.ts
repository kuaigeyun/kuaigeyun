import type { FC } from 'react';

export interface IChange {
  action: 'add' | 'update' | 'delete';
  id?: string | number;
  task?: ITask;
  value: ITask[];
  originalValue: string | number | ITask[];
}

export interface ITask {
  id?: string | number;
  content: string;
  status?: number;
}

export declare const Tasklist: FC<{
  ondata?: (value: string | number) => Promise<ITask[]> | ITask[];
  onChange?: (ev: IChange) => void;
  value?: string | number | ITask[];
  readonly?: boolean;
}>;
