import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Play, Square, Trash2, ArrowLeft } from 'lucide-react';

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', id],
    queryFn: () => api.getAgent(id!),
    enabled: !!id,
  });

  const { data: logs } = useQuery({
    queryKey: ['agent-logs', id],
    queryFn: () => api.getAgentLogs(id!),
    enabled: !!id,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const { data: metrics } = useQuery({
    queryKey: ['agent-metrics', id],
    queryFn: () => api.getAgentMetrics(id!),
    enabled: !!id,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const deployMutation = useMutation({
    mutationFn: () => api.deployAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: () => api.stopAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteAgent(id!),
    onSuccess: () => {
      navigate('/');
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading agent...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Agent not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-secondary rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          {agent.config.description && (
            <p className="text-muted-foreground">{agent.config.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {agent.status === 'running' ? (
            <button
              onClick={() => stopMutation.mutate()}
              disabled={stopMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={() => deployMutation.mutate()}
              disabled={deployMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Deploy
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this agent?')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="text-2xl font-semibold capitalize">{agent.status}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Tasks Completed</div>
          <div className="text-2xl font-semibold">{metrics?.tasks_completed || 0}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Uptime</div>
          <div className="text-2xl font-semibold">
            {metrics?.uptime_seconds
              ? `${Math.floor(metrics.uptime_seconds / 60)}m`
              : '0m'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <div className="p-4 border rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Model:</span>{' '}
              <span className="font-medium">{agent.config.model}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Temperature:</span>{' '}
              <span className="font-medium">{agent.config.temperature}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Deployment:</span>{' '}
              <span className="font-medium">{agent.config.deployment.type}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Sandbox:</span>{' '}
              <span className="font-medium">{agent.config.deployment.sandbox}</span>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block mb-1">System Prompt:</span>
            <pre className="text-sm bg-secondary p-3 rounded overflow-auto whitespace-pre-wrap">
              {agent.config.system_prompt}
            </pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Logs</h2>
        <div className="border rounded-lg overflow-hidden">
          {logs?.logs.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No logs yet</div>
          ) : (
            <div className="divide-y max-h-96 overflow-auto">
              {logs?.logs.map((log) => (
                <div key={log.id} className="p-3 hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{log.action_type}</div>
                      {log.tool_name && (
                        <div className="text-xs text-muted-foreground">Tool: {log.tool_name}</div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
