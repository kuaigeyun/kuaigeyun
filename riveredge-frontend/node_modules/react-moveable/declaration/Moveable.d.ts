import { MoveableProps, Able } from "./types";
import { InitialMoveable } from "./InitialMoveable";
export default class Moveable<T = {}> extends InitialMoveable<MoveableProps & T> {
    static defaultAbles: Able[];
}
