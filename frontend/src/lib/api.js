import { supabase } from './supabase';
const API_BASE = import.meta.env.VITE_API_BASE || '/api';
class ApiClient {
    async getAuthHeaders() {
        const { data: { session }, } = await supabase.auth.getSession();
        if (session?.access_token) {
            return {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            };
        }
        return {
            'Content-Type': 'application/json',
        };
    }
    async fetch(url, options) {
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers: {
                ...headers,
                ...options?.headers,
            },
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || 'API request failed');
        }
        return response.json();
    }
    // Agent operations
    async getAgents() {
        return this.fetch('/agents');
    }
    async getAgent(id) {
        return this.fetch(`/agents/${id}`);
    }
    async createAgent(config) {
        return this.fetch('/agents', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }
    async updateAgent(id, config) {
        return this.fetch(`/agents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(config),
        });
    }
    async deleteAgent(id) {
        await this.fetch(`/agents/${id}`, {
            method: 'DELETE',
        });
    }
    async deployAgent(id) {
        await this.fetch(`/agents/${id}/deploy`, {
            method: 'POST',
        });
    }
    async stopAgent(id) {
        await this.fetch(`/agents/${id}/stop`, {
            method: 'POST',
        });
    }
    async getAgentLogs(id, params) {
        const query = new URLSearchParams(params).toString();
        return this.fetch(`/agents/${id}/logs${query ? `?${query}` : ''}`);
    }
    async getAgentMetrics(id) {
        return this.fetch(`/agents/${id}/metrics`);
    }
    // WebSocket for live logs
    connectToLogs(agentId) {
        const wsUrl = `${API_BASE.replace('http', 'ws')}/agents/${agentId}/logs/stream`;
        return new WebSocket(wsUrl);
    }
}
export const api = new ApiClient();
//# sourceMappingURL=api.js.map