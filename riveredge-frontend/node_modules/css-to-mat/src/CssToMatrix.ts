import { splitComma, splitBracket, splitUnit, splitSpace, isArray, convertUnitSize, isObject } from "@daybrush/utils";
import { MatrixInfo } from "./types";
import { calculate, invert, matrix3d, rotateX3d, rotateY3d, rotateZ3d, scale3d, translate3d } from "@scena/matrix";

export function createMatrix() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}
export function parseMat(transform: string | string[], size: number | Record<string, ((pos: number) => number) | number> = 0): number[] {
    return toMat(parse(transform, size));
}
export function getElementMatrix(el: HTMLElement) {
    return parseMat(getComputedStyle(el).transform!);
}
export function calculateMatrixDist(matrix: number[], pos: number[]) {
    const res = calculate(matrix, [pos[0], pos[1] || 0, pos[2] || 0, 1], 4);
    const w = res[3] || 1;

    return [
        res[0] / w,
        res[1] / w,
        res[2] / w,
    ];
}
export function getDistElementMatrix(el: HTMLElement, container = document.body): number[] {
    let target: HTMLElement | null = el;
    let matrix = createMatrix();

    while (target) {
        const transform = getComputedStyle(target).transform!;
        matrix = matrix3d(parseMat(transform), matrix);

        if (target === container) {
            break;
        }
        target = target.parentElement;
    }
    matrix = invert(matrix, 4);

    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;

    return matrix;
}

export function toMat(matrixInfos: MatrixInfo[]): number[] {
    let target = createMatrix();

    matrixInfos.forEach(info => {
        const {
            matrixFunction,
            functionValue,
        } = info;

        if (!matrixFunction) {
            return;
        }
        target = matrixFunction(target, functionValue);
    });
    return target;
}
export function parse(transform: string | string[], size: number | Record<string, ((pos: number) => number) | number> = 0): MatrixInfo[] {
    const transforms = isArray(transform) ? transform : splitSpace(transform);

    return transforms.map(t => {
        const { prefix: name, value } = splitBracket(t);


        let matrixFunction = null;
        let functionName: string = name;
        let functionValue: any = "";

        if (name === "translate" || name === "translateX" || name === "translate3d") {
            const nextSize = isObject(size) ? {
                ...size,
                "o%": size["%"],
            } : {
                "%": size,
                "o%": size,
            };
            const [posX, posY = 0, posZ = 0] = splitComma(value!).map((v, i) => {
                if (i === 0 && "x%" in nextSize) {
                    nextSize["%"] = size["x%"];
                } else if (i === 1 && "y%" in nextSize) {
                    nextSize["%"] = size["y%"];
                } else {
                    nextSize["%"] = size["o%"];
                }
                return convertUnitSize(v, nextSize);
            });

            matrixFunction = translate3d;
            functionValue = [posX, posY, posZ];
        } else if (name === "translateY") {
            const nextSize = isObject(size) ? {
                "%": size["y%"],
                ...size,
            } : {
                "%": size,
            };
            const posY = convertUnitSize(value!, nextSize);

            matrixFunction = translate3d;
            functionValue = [0, posY, 0];
        } else if (name === "translateZ") {
            const posZ = parseFloat(value!);

            matrixFunction = translate3d;
            functionValue = [0, 0, posZ];
        } else if (name === "scale" || name === "scale3d") {
            const [sx, sy = sx, sz = 1] = splitComma(value!).map(v => parseFloat(v)) as number[];

            matrixFunction = scale3d;
            functionValue = [sx, sy, sz];
        } else if (name === "scaleX") {
            const sx = parseFloat(value!);

            matrixFunction = scale3d;
            functionValue = [sx, 1, 1];
        } else if (name === "scaleY") {
            const sy = parseFloat(value!);

            matrixFunction = scale3d;
            functionValue = [1, sy, 1];
        } else if (name === "scaleZ") {
            const sz = parseFloat(value!);

            matrixFunction = scale3d;
            functionValue = [1, 1, sz];
        } else if (name === "rotate" || name === "rotateZ" || name === "rotateX" || name === "rotateY") {
            const { unit, value: unitValue } = splitUnit(value!);
            const rad = unit === "rad" ? unitValue : unitValue * Math.PI / 180;

            if (name === "rotate" || name === "rotateZ") {
                functionName = "rotateZ";
                matrixFunction = rotateZ3d;
            } else if (name === "rotateX") {
                matrixFunction = rotateX3d;
            } else if (name === "rotateY") {
                matrixFunction = rotateY3d;
            }
            functionValue = rad;
        } else if (name === "matrix3d") {
            matrixFunction = matrix3d;
            functionValue = splitComma(value!).map(v => parseFloat(v));
        } else if (name === "matrix") {
            const m = splitComma(value!).map(v => parseFloat(v));
            matrixFunction = matrix3d;
            functionValue = [
                m[0], m[1], 0, 0,
                m[2], m[3], 0, 0,
                0, 0, 1, 0,
                m[4], m[5], 0, 1,
            ];
        } else {
            functionName = "";
        }
        return {
            name: name!,
            functionName,
            value: value!,
            matrixFunction,
            functionValue,
        };
    });
}
