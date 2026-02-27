import { AgentInfo } from "./types";
import { getLegacyAgent } from "./userAgent";
export declare function getAccurateAgent(callback?: (result: AgentInfo) => void): Promise<AgentInfo> | null;
declare function agent(userAgent?: string): AgentInfo;
export { getLegacyAgent };
export default agent;
export * from "./types";
