import * as React from 'react';
import type { AnyObject } from '../../_util/type';
declare const useMergedPickerSemantic: <P extends AnyObject = AnyObject>(pickerType: "timePicker" | "datePicker", classNames?: P["classNames"], styles?: P["styles"], popupClassName?: string, popupStyle?: React.CSSProperties, mergedProps?: P) => readonly [classNames: Partial<Record<import("@rc-component/picker/interface").SemanticName, string>> & {
    popup: import("../../_util/hooks").SemanticClassNames<import("@rc-component/picker/interface").PanelSemanticName>;
}, styles: Partial<Record<import("@rc-component/picker/interface").SemanticName, React.CSSProperties>> & {
    popup: import("../../_util/hooks").SemanticStyles<import("@rc-component/picker/interface").PanelSemanticName>;
}];
export default useMergedPickerSemantic;
