import { Nullable, Disposable } from '@univerjs/core';
import { Observable } from 'rxjs';
import { ISuperTable, TableOptionType } from '../basics/common';
export interface ISuperTableOptionParam {
    tableOption: string;
    tableOptionType: TableOptionType;
}
export interface ISuperTableService {
    getTableMap(unitId: string): Nullable<Map<string, ISuperTable>>;
    getTableOptionMap(): Map<string, TableOptionType>;
    registerTable(unitId: string, tableName: string, reference: ISuperTable): void;
    registerTableOptionMap(tableOption: string, tableOptionType: TableOptionType): void;
    remove(unitId: string, tableName: string): void;
    update$: Observable<unknown>;
}
export declare class SuperTableService extends Disposable implements ISuperTableService {
    private _tableMap;
    private _tableOptionMap;
    private readonly _update$;
    readonly update$: Observable<unknown>;
    constructor();
    dispose(): void;
    remove(unitId: string, tableName: string): void;
    getTableMap(unitId: string): Map<string, ISuperTable> | undefined;
    getTableOptionMap(): Map<string, TableOptionType>;
    registerTable(unitId: string, tableName: string, reference: ISuperTable): void;
    registerTableOptionMap(tableOption: string, tableOptionType: TableOptionType): void;
    private _update;
}
export declare const ISuperTableService: import('@wendellhu/redi').IdentifierDecorator<ISuperTableService>;
