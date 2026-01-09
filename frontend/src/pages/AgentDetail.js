import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Play, Square, Trash2, ArrowLeft } from 'lucide-react';
export default function AgentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: agent, isLoading } = useQuery({
        queryKey: ['agent', id],
        queryFn: () => api.getAgent(id),
        enabled: !!id,
    });
    const { data: logs } = useQuery({
        queryKey: ['agent-logs', id],
        queryFn: () => api.getAgentLogs(id),
        enabled: !!id,
        refetchInterval: 5000, // Refetch every 5 seconds
    });
    const { data: metrics } = useQuery({
        queryKey: ['agent-metrics', id],
        queryFn: () => api.getAgentMetrics(id),
        enabled: !!id,
        refetchInterval: 10000, // Refetch every 10 seconds
    });
    const deployMutation = useMutation({
        mutationFn: () => api.deployAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agent', id] });
        },
    });
    const stopMutation = useMutation({
        mutationFn: () => api.stopAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agent', id] });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => api.deleteAgent(id),
        onSuccess: () => {
            navigate('/');
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-muted-foreground", children: "Loading agent..." }) }));
    }
    if (!agent) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-destructive", children: "Agent not found" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/'), className: "p-2 hover:bg-secondary rounded-md transition-colors", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-3xl font-bold", children: agent.name }), agent.config.description && (_jsx("p", { className: "text-muted-foreground", children: agent.config.description }))] }), _jsxs("div", { className: "flex gap-2", children: [agent.status === 'running' ? (_jsxs("button", { onClick: () => stopMutation.mutate(), disabled: stopMutation.isPending, className: "inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50", children: [_jsx(Square, { className: "w-4 h-4" }), "Stop"] })) : (_jsxs("button", { onClick: () => deployMutation.mutate(), disabled: deployMutation.isPending, className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50", children: [_jsx(Play, { className: "w-4 h-4" }), "Deploy"] })), _jsxs("button", { onClick: () => {
                                    if (confirm('Are you sure you want to delete this agent?')) {
                                        deleteMutation.mutate();
                                    }
                                }, disabled: deleteMutation.isPending, className: "inline-flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Delete"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Status" }), _jsx("div", { className: "text-2xl font-semibold capitalize", children: agent.status })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Tasks Completed" }), _jsx("div", { className: "text-2xl font-semibold", children: metrics?.tasks_completed || 0 })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Uptime" }), _jsx("div", { className: "text-2xl font-semibold", children: metrics?.uptime_seconds
                                    ? `${Math.floor(metrics.uptime_seconds / 60)}m`
                                    : '0m' })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Configuration" }), _jsxs("div", { className: "p-4 border rounded-lg space-y-2", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Model:" }), ' ', _jsx("span", { className: "font-medium", children: agent.config.model })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Temperature:" }), ' ', _jsx("span", { className: "font-medium", children: agent.config.temperature })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Deployment:" }), ' ', _jsx("span", { className: "font-medium", children: agent.config.deployment.type })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Sandbox:" }), ' ', _jsx("span", { className: "font-medium", children: agent.config.deployment.sandbox })] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-muted-foreground block mb-1", children: "System Prompt:" }), _jsx("pre", { className: "text-sm bg-secondary p-3 rounded overflow-auto whitespace-pre-wrap", children: agent.config.system_prompt })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Recent Logs" }), _jsx("div", { className: "border rounded-lg overflow-hidden", children: logs?.logs.length === 0 ? (_jsx("div", { className: "p-4 text-center text-muted-foreground", children: "No logs yet" })) : (_jsx("div", { className: "divide-y max-h-96 overflow-auto", children: logs?.logs.map((log) => (_jsx("div", { className: "p-3 hover:bg-secondary transition-colors", children: _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: log.action_type }), log.tool_name && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["Tool: ", log.tool_name] }))] }), _jsx("div", { className: "text-xs text-muted-foreground", children: new Date(log.timestamp).toLocaleString() })] }) }, log.id))) })) })] })] }));
}
//# sourceMappingURL=AgentDetail.js.map