import type { Agent, CreateAgentRequest, UpdateAgentRequest, AgentListResponse, LogsResponse, MetricsResponse } from '@claude-studio/shared-types';
declare class ApiClient {
    private getAuthHeaders;
    private fetch;
    getAgents(): Promise<AgentListResponse>;
    getAgent(id: string): Promise<Agent>;
    createAgent(config: CreateAgentRequest): Promise<Agent>;
    updateAgent(id: string, config: UpdateAgentRequest): Promise<Agent>;
    deleteAgent(id: string): Promise<void>;
    deployAgent(id: string): Promise<void>;
    stopAgent(id: string): Promise<void>;
    getAgentLogs(id: string, params?: {
        limit?: number;
        offset?: number;
        action_type?: string;
        tool_name?: string;
    }): Promise<LogsResponse>;
    getAgentMetrics(id: string): Promise<MetricsResponse>;
    connectToLogs(agentId: string): WebSocket;
}
export declare const api: ApiClient;
export {};
//# sourceMappingURL=api.d.ts.map