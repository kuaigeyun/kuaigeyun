import { Plugin } from '@pdfme/common';
import { DateSchema } from './types.js';
type PickerType = 'date' | 'time' | 'dateTime';
export declare const getPlugin: ({ type, icon }: {
    type: PickerType;
    icon: string;
}) => Plugin<DateSchema>;
export {};
