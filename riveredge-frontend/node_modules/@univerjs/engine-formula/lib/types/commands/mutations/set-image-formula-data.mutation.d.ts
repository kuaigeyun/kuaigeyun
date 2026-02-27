import { IMutation } from '@univerjs/core';
import { IRuntimeImageFormulaDataType } from '../../basics/common';
export interface ISetImageFormulaDataMutationParams {
    imageFormulaData: IRuntimeImageFormulaDataType[];
}
/**
 * There is no need to process data here, it is used as the main thread to send data to the worker. The main thread has already updated the data in advance, and there is no need to update it again here.
 */
export declare const SetImageFormulaDataMutation: IMutation<ISetImageFormulaDataMutationParams>;
