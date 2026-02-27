import { RangePermissionPointConstructor, WorkbookPermissionPointConstructor, WorkSheetPermissionPointConstructor } from '@univerjs/core';
import { RangePermissionPoint, WorkbookPermissionPoint, WorksheetPermissionPoint } from './permission-types';
/**
 * Mapping table from Workbook permission point enum to class constructors
 */
export declare const WORKBOOK_PERMISSION_POINT_MAP: Record<WorkbookPermissionPoint, WorkbookPermissionPointConstructor>;
/**
 * Mapping table from Worksheet permission point enum to class constructors
 */
export declare const WORKSHEET_PERMISSION_POINT_MAP: Record<WorksheetPermissionPoint, WorkSheetPermissionPointConstructor>;
/**
 * Mapping table from Range permission point enum to class constructors
 */
export declare const RANGE_PERMISSION_POINT_MAP: Record<RangePermissionPoint, RangePermissionPointConstructor>;
