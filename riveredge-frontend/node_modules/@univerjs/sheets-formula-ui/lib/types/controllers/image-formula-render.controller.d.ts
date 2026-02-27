import { Disposable, IUniverInstanceService } from '@univerjs/core';
import { IRenderManagerService } from '@univerjs/engine-render';
import { ImageFormulaCellInterceptorController } from '@univerjs/sheets-formula';
export declare class ImageFormulaRenderController extends Disposable {
    private readonly _imageFormulaCellInterceptorController;
    private readonly _renderManagerService;
    private readonly _univerInstanceService;
    constructor(_imageFormulaCellInterceptorController: ImageFormulaCellInterceptorController, _renderManagerService: IRenderManagerService, _univerInstanceService: IUniverInstanceService);
}
