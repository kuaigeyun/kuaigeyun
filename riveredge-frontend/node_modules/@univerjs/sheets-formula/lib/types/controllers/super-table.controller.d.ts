import { Disposable, ICommandService, IUniverInstanceService } from '@univerjs/core';
import { ISuperTableService } from '@univerjs/engine-formula';
import { IDescriptionService } from '../services/description.service';
/**
 * header highlight
 * column menu: show, hover and mousedown event
 */
export declare class SuperTableController extends Disposable {
    private readonly _descriptionService;
    private readonly _univerInstanceService;
    private readonly _commandService;
    private readonly _superTableService;
    private _preUnitId;
    constructor(_descriptionService: IDescriptionService, _univerInstanceService: IUniverInstanceService, _commandService: ICommandService, _superTableService: ISuperTableService);
    private _initialize;
    private _descriptionListener;
    private _changeUnitListener;
    private _changeSheetListener;
    private _registerDescription;
    private _unregisterDescription;
    private _unRegisterDescriptions;
    private _getUnitIdAndSheetId;
    private _registerDescriptions;
    private _unregisterDescriptionsForNotInSheetId;
}
