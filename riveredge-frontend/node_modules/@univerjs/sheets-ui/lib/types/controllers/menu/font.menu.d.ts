import { IAccessor } from '@univerjs/core';
import { IMenuButtonItem, IMenuSelectorItem, MenuItemType } from '@univerjs/ui';
import { Observable } from 'rxjs';
export declare function FontSizeSelectorMenuItemFactory(accessor: IAccessor): IMenuSelectorItem<number>;
export declare function FontSizeIncreaseMenuItemFactory(accessor: IAccessor): IMenuButtonItem;
export declare function FontSizeDecreaseMenuItemFactory(accessor: IAccessor): {
    id: string;
    type: MenuItemType;
    icon: string;
    tooltip: string;
    disabled$: Observable<boolean>;
    hidden$: Observable<boolean>;
};
