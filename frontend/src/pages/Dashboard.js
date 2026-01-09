import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Plus } from 'lucide-react';
export default function Dashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ['agents'],
        queryFn: () => api.getAgents(),
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Dashboard" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your autonomous agents" })] }), _jsxs(Link, { to: "/agents/new", className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Agent"] })] }), isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-muted-foreground", children: "Loading agents..." }) })) : data?.agents.length === 0 ? (_jsxs("div", { className: "text-center py-12 border border-dashed rounded-lg", children: [_jsx("p", { className: "text-muted-foreground mb-4", children: "No agents yet" }), _jsxs(Link, { to: "/agents/new", className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Create your first agent"] })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: data?.agents.map((agent) => (_jsxs(Link, { to: `/agents/${agent.id}`, className: "block p-6 border rounded-lg hover:border-primary transition-colors", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("h3", { className: "font-semibold", children: agent.name }), _jsx("span", { className: `text-xs px-2 py-1 rounded-full ${agent.status === 'running'
                                        ? 'bg-green-100 text-green-800'
                                        : agent.status === 'stopped'
                                            ? 'bg-gray-100 text-gray-800'
                                            : agent.status === 'error'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'}`, children: agent.status })] }), agent.config.description && (_jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: agent.config.description }))] }, agent.id))) }))] }));
}
//# sourceMappingURL=Dashboard.js.map