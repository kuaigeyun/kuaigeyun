import { IMutation } from '@univerjs/core';
export interface ICopyWorksheetEndMutationParams {
    unitId: string;
    subUnitId: string;
}
/**
 * This mutation is used to mark the end of a copy worksheet operation that was split into chunks.
 * When this mutation is applied on the server, it should trigger a snapshot save.
 */
export declare const CopyWorksheetEndMutation: IMutation<ICopyWorksheetEndMutationParams, boolean>;
