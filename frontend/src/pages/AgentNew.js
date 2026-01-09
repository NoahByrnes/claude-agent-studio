import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
export default function AgentNew() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        system_prompt: '',
        model: 'claude-sonnet-4-5',
        temperature: 0.2,
        mcp_servers: [],
        deployment: {
            type: 'event-driven',
            sandbox: 'cloudflare',
            auto_restart: true,
        },
    });
    const createMutation = useMutation({
        mutationFn: (data) => api.createAgent(data),
        onSuccess: (agent) => {
            navigate(`/agents/${agent.id}`);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Create New Agent" }), _jsx("p", { className: "text-muted-foreground", children: "Configure your autonomous agent" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full px-3 py-2 border rounded-md", placeholder: "e.g., AP Invoice Processor", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Description" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-3 py-2 border rounded-md", placeholder: "Brief description of what this agent does" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "System Prompt" }), _jsx("textarea", { value: formData.system_prompt, onChange: (e) => setFormData({ ...formData, system_prompt: e.target.value }), className: "w-full px-3 py-2 border rounded-md h-32", placeholder: "You are an AI assistant that...", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Model" }), _jsxs("select", { value: formData.model, onChange: (e) => setFormData({ ...formData, model: e.target.value }), className: "w-full px-3 py-2 border rounded-md", children: [_jsx("option", { value: "claude-sonnet-4-5", children: "Claude Sonnet 4.5" }), _jsx("option", { value: "claude-opus-4-5", children: "Claude Opus 4.5" }), _jsx("option", { value: "claude-haiku-4", children: "Claude Haiku 4" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Temperature" }), _jsx("input", { type: "number", value: formData.temperature, onChange: (e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) }), className: "w-full px-3 py-2 border rounded-md", min: "0", max: "1", step: "0.1" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Deployment Type" }), _jsxs("select", { value: formData.deployment.type, onChange: (e) => setFormData({
                                            ...formData,
                                            deployment: {
                                                ...formData.deployment,
                                                type: e.target.value,
                                            },
                                        }), className: "w-full px-3 py-2 border rounded-md", children: [_jsx("option", { value: "event-driven", children: "Event-driven" }), _jsx("option", { value: "long-running", children: "Long-running" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium", children: "Sandbox" }), _jsxs("select", { value: formData.deployment.sandbox, onChange: (e) => setFormData({
                                            ...formData,
                                            deployment: {
                                                ...formData.deployment,
                                                sandbox: e.target.value,
                                            },
                                        }), className: "w-full px-3 py-2 border rounded-md", children: [_jsx("option", { value: "cloudflare", children: "Cloudflare" }), _jsx("option", { value: "e2b", children: "E2B" }), _jsx("option", { value: "local", children: "Local" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "auto_restart", checked: formData.deployment.auto_restart, onChange: (e) => setFormData({
                                    ...formData,
                                    deployment: {
                                        ...formData.deployment,
                                        auto_restart: e.target.checked,
                                    },
                                }), className: "rounded" }), _jsx("label", { htmlFor: "auto_restart", className: "text-sm", children: "Auto-restart on failure" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", disabled: createMutation.isPending, className: "px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50", children: createMutation.isPending ? 'Creating...' : 'Create Agent' }), _jsx("button", { type: "button", onClick: () => navigate('/'), className: "px-6 py-2 border rounded-md hover:bg-secondary transition-colors", children: "Cancel" })] }), createMutation.isError && (_jsxs("p", { className: "text-sm text-destructive", children: ["Error: ", createMutation.error.message] }))] })] }));
}
//# sourceMappingURL=AgentNew.js.map