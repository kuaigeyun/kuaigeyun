import { Client, Position } from "./types";
export declare class ClientStore {
    prevClients: Client[];
    startClients: Client[];
    movement: number;
    length: number;
    constructor(clients: Client[]);
    getAngle(clients?: Client[]): number;
    getRotation(clients?: Client[]): number;
    getPosition(clients?: Client[], isAdd?: boolean): Position;
    getPositions(clients?: Client[]): Position[];
    getMovement(clients?: Client[]): number;
    getDistance(clients?: Client[]): number;
    getScale(clients?: Client[]): number;
    move(deltaX: number, deltaY: number): void;
}
