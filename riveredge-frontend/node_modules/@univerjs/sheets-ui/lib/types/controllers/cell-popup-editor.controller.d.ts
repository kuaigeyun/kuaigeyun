import { Workbook, Disposable } from '@univerjs/core';
import { IRenderContext, IRenderModule } from '@univerjs/engine-render';
import { CellPopupManagerService } from '../services/cell-popup-manager.service';
import { IEditorBridgeService } from '../services/editor-bridge.service';
/**
 * Controller to hide cell popups when entering edit mode.
 * This ensures that popups don't overlap with the cell editor.
 */
export declare class CellPopupEditorController extends Disposable implements IRenderModule {
    private readonly _context;
    private readonly _editorBridgeService;
    private readonly _cellPopupManagerService;
    constructor(_context: IRenderContext<Workbook>, _editorBridgeService: IEditorBridgeService, _cellPopupManagerService: CellPopupManagerService);
    private _initEditorVisibleListener;
}
