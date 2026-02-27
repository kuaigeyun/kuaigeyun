import { RenderGuidelineInfo, Renderer, RenderGuidelineInnerInfo, MoveableManagerInterface, SnappableProps, SnapGuideline, SnappableRenderType, SnappableState, SnapDirectionPoses } from "../../types";
export declare function renderGuideline(info: RenderGuidelineInfo, React: Renderer): any;
export declare function renderInnerGuideline(info: RenderGuidelineInnerInfo, React: Renderer): any;
export declare function renderSnapPoses(moveable: MoveableManagerInterface, direction: string, snapPoses: SnappableRenderType[], minPos: number, targetPos: number, size: number, index: number, React: Renderer): any[];
export declare function renderGuidelines(moveable: MoveableManagerInterface<SnappableProps>, type: "vertical" | "horizontal", guidelines: SnapGuideline[], targetPos: number[], targetRect: SnapDirectionPoses, React: Renderer): any[];
export declare function renderDigitLine(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, type: "vertical" | "horizontal", lineType: "dashed" | "gap", index: number, gap: number, renderPos: number[], className: string | undefined, React: Renderer): any;
export declare function groupByElementGuidelines(type: "vertical" | "horizontal", guidelines: SnapGuideline[], targetRect: SnapDirectionPoses, isDisplayInnerSnapDigit: boolean): {
    total: SnapGuideline[];
    start: SnapGuideline[];
    end: SnapGuideline[];
    inner: SnapGuideline[];
}[];
export declare function renderDashedGuidelines(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, guidelines: SnapGuideline[], targetPos: number[], targetRect: SnapDirectionPoses, React: Renderer): any[];
export declare function renderGapGuidelines(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, guidelines: SnapGuideline[], targetPos: number[], targetRect: SnapDirectionPoses, React: any): any[];
