import * as React from 'react';
export type BatchTask = (key: string, callback: VoidFunction) => void;
export interface BatchUpdateRef {
    batch: BatchTask;
}
declare const BatchUpdate: React.ForwardRefExoticComponent<React.RefAttributes<BatchUpdateRef>>;
export default BatchUpdate;
