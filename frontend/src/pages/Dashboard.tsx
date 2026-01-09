import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api.getAgents(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your autonomous agents</p>
        </div>
        <Link
          to="/agents/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading agents...</p>
        </div>
      ) : data?.agents.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No agents yet</p>
          <Link
            to="/agents/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create your first agent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.agents.map((agent) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.id}`}
              className="block p-6 border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{agent.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    agent.status === 'running'
                      ? 'bg-green-100 text-green-800'
                      : agent.status === 'stopped'
                      ? 'bg-gray-100 text-gray-800'
                      : agent.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              {agent.config.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {agent.config.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
