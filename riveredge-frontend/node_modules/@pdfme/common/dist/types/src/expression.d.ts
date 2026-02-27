import type { SchemaPageArray } from './types.js';
export declare const replacePlaceholders: (arg: {
    content: string;
    variables: Record<string, unknown>;
    schemas: SchemaPageArray;
}) => string;
