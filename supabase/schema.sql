-- Claude Agent Studio Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agent status enum
CREATE TYPE agent_status AS ENUM ('idle', 'running', 'stopped', 'error', 'deploying');

-- Agents Table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status agent_status NOT NULL DEFAULT 'idle',
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  state JSONB NOT NULL DEFAULT '{}',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  action_type VARCHAR(100) NOT NULL,
  tool_name VARCHAR(100),
  input_data JSONB,
  output_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MCP Connectors Table
CREATE TABLE mcp_connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  credentials_vault_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Events Table
CREATE TABLE agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  processed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX agents_user_idx ON agents(user_id);
CREATE INDEX agents_status_idx ON agents(status);
CREATE INDEX sessions_agent_idx ON sessions(agent_id);
CREATE INDEX audit_logs_agent_idx ON audit_logs(agent_id);
CREATE INDEX audit_logs_timestamp_idx ON audit_logs(timestamp DESC);
CREATE INDEX agent_events_agent_idx ON agent_events(agent_id);
CREATE INDEX agent_events_processed_idx ON agent_events(processed) WHERE processed IS NULL;

-- Row Level Security (RLS) Policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

-- Users can only access their own agents
CREATE POLICY "Users can view own agents" ON agents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agents" ON agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents" ON agents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents" ON agents
  FOR DELETE USING (auth.uid() = user_id);

-- Sessions are accessible if user owns the agent
CREATE POLICY "Users can view own agent sessions" ON sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = sessions.agent_id AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent sessions" ON sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = sessions.agent_id AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own agent sessions" ON sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = sessions.agent_id AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own agent sessions" ON sessions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = sessions.agent_id AND agents.user_id = auth.uid()
    )
  );

-- Audit logs are accessible if user owns the agent
CREATE POLICY "Users can view own agent logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = audit_logs.agent_id AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent logs" ON audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = audit_logs.agent_id AND agents.user_id = auth.uid()
    )
  );

-- Agent events are accessible if user owns the agent
CREATE POLICY "Users can view own agent events" ON agent_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = agent_events.agent_id AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent events" ON agent_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents WHERE agents.id = agent_events.agent_id AND agents.user_id = auth.uid()
    )
  );

-- MCP Connectors are globally readable (no RLS needed for now)
-- Add RLS later if you want per-user connectors
