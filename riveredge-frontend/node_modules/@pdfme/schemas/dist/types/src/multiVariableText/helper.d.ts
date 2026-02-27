import { MultiVariableTextSchema } from './types.js';
export declare const substituteVariables: (text: string, variablesIn: string | Record<string, string>) => string;
export declare const validateVariables: (value: string, schema: MultiVariableTextSchema) => boolean;
