import { Client, Position } from "./types";
import { IArrayFormat } from "@daybrush/utils";
export declare function getRad(pos1: number[], pos2: number[]): number;
export declare function getRotatiion(touches: Client[]): number;
export declare function isMultiTouch(e: any): e is TouchEvent;
export declare function getEventClients(e: any): Client[];
export declare function isMouseEvent(e: any): e is MouseEvent;
export declare function getPosition(clients: Client[], prevClients: Client[], startClients: Client[]): Position;
export declare function getDist(clients: Client[]): number;
export declare function getClients(touches: IArrayFormat<Touch>): Client[];
export declare function getClient(e: MouseEvent | Touch): Client;
export declare function getAverageClient(clients: Client[], length?: number): Required<Client>;
export declare function plueClient(client1: Client, client2: Client): {
    clientX: number;
    clientY: number;
};
export declare function minusClient(client1: Client, client2: Client): {
    clientX: number;
    clientY: number;
};
