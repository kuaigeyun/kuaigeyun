import { IMenuSchema } from '../../../../services/menu/menu-manager.service';
export declare function ClassicMenu({ ribbon, activatedTab, onSelectTab, }: {
    ribbon: IMenuSchema[];
    activatedTab: string;
    onSelectTab: (tab: IMenuSchema) => void;
}): import("react/jsx-runtime").JSX.Element;
