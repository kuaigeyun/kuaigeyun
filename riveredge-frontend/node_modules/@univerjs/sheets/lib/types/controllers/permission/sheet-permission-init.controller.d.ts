import { Disposable, IAuthzIoService, ICommandService, IPermissionService, IUndoRedoService, IUniverInstanceService, UserManagerService } from '@univerjs/core';
import { RangeProtectionRuleModel } from '../../model/range-protection-rule.model';
import { WorkbookPermissionService } from '../../services/permission/workbook-permission/workbook-permission.service';
import { WorksheetProtectionPointModel, WorksheetProtectionRuleModel } from '../../services/permission/worksheet-permission';
export declare class SheetPermissionInitController extends Disposable {
    private readonly _univerInstanceService;
    private _permissionService;
    private _authzIoService;
    private _rangeProtectionRuleModel;
    private _worksheetProtectionRuleModel;
    private _userManagerService;
    private _worksheetProtectionPointRuleModel;
    private _workbookPermissionService;
    private _undoRedoService;
    private _commandService;
    constructor(_univerInstanceService: IUniverInstanceService, _permissionService: IPermissionService, _authzIoService: IAuthzIoService, _rangeProtectionRuleModel: RangeProtectionRuleModel, _worksheetProtectionRuleModel: WorksheetProtectionRuleModel, _userManagerService: UserManagerService, _worksheetProtectionPointRuleModel: WorksheetProtectionPointModel, _workbookPermissionService: WorkbookPermissionService, _undoRedoService: IUndoRedoService, _commandService: ICommandService);
    initPermission(): void;
    refreshRangeProtectPermission(): void;
    private _initRangePermissionFromSnapshot;
    private _initRangePermissionChange;
    initWorkbookPermissionChange(_unitId?: string): Promise<void>;
    private _initWorkbookPermissionFromSnapshot;
    private _initWorksheetPermissionChange;
    private _initWorksheetPermissionPointsChange;
    private _initWorksheetPermissionFromSnapshot;
    private _initUserChange;
    refreshPermission(unitId: string, permissionId: string): void;
    private _refreshPermissionByCollaCreate;
}
