import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { CreateAgentRequest } from '@claude-studio/shared-types';

export default function AgentNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAgentRequest>({
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
    mutationFn: (data: CreateAgentRequest) => api.createAgent(data),
    onSuccess: (agent) => {
      navigate(`/agents/${agent.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Agent</h1>
        <p className="text-muted-foreground">Configure your autonomous agent</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., AP Invoice Processor"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Brief description of what this agent does"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">System Prompt</label>
          <textarea
            value={formData.system_prompt}
            onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
            className="w-full px-3 py-2 border rounded-md h-32"
            placeholder="You are an AI assistant that..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Model</label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
              <option value="claude-opus-4-5">Claude Opus 4.5</option>
              <option value="claude-haiku-4">Claude Haiku 4</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Temperature</label>
            <input
              type="number"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({ ...formData, temperature: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              max="1"
              step="0.1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Deployment Type</label>
            <select
              value={formData.deployment.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deployment: {
                    ...formData.deployment,
                    type: e.target.value as 'long-running' | 'event-driven',
                  },
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="event-driven">Event-driven</option>
              <option value="long-running">Long-running</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Sandbox</label>
            <select
              value={formData.deployment.sandbox}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deployment: {
                    ...formData.deployment,
                    sandbox: e.target.value as 'cloudflare' | 'e2b' | 'local',
                  },
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cloudflare">Cloudflare</option>
              <option value="e2b">E2B</option>
              <option value="local">Local</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="auto_restart"
            checked={formData.deployment.auto_restart}
            onChange={(e) =>
              setFormData({
                ...formData,
                deployment: {
                  ...formData.deployment,
                  auto_restart: e.target.checked,
                },
              })
            }
            className="rounded"
          />
          <label htmlFor="auto_restart" className="text-sm">
            Auto-restart on failure
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Agent'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border rounded-md hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
        </div>

        {createMutation.isError && (
          <p className="text-sm text-destructive">
            Error: {(createMutation.error as Error).message}
          </p>
        )}
      </form>
    </div>
  );
}
