import { IFontConfig } from '../../services/font.service';
export type RibbonType = 'default' | 'simple' | 'classic';
export interface IWorkbenchOptions {
    container?: string | HTMLElement;
    /**
     * If Univer should make the header bar visible.
     */
    header?: boolean;
    /**
     * If Univer should make the toolbar bar visible.
     */
    toolbar?: boolean;
    /**
     * The type of ribbon to be used in the UI.
     */
    ribbonType?: RibbonType;
    /**
     * Custom font family list to be added to the font service.
     */
    customFontFamily?: IFontConfig[];
    /**
     * If Univer should make the footer bar visible.
     */
    footer?: boolean;
    /**
     * If Univer should make the context menu usable.
     */
    contextMenu?: boolean;
    /**
     * If Univer should make the header menu visible.
     */
    headerMenu?: boolean;
}
export interface IUIController {
}
export declare const IUIController: import('@wendellhu/redi').IdentifierDecorator<IUIController>;
