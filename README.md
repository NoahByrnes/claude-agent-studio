# Claude Agent Studio

A deployment foundry (control plane) for autonomous Claude agents. Agents live in sandboxed environments and interact via external channels (email, SMS, etc.). The platform provides configuration, deployment, monitoring, and admin access.

## Features

- **Agent Management**: Create, configure, and deploy autonomous Claude agents
- **Sandbox Deployment**: Run agents in Cloudflare Sandboxes or E2B
- **Event-Driven Architecture**: Agents respond to events (emails, SMS, webhooks)
- **Real-time Monitoring**: Live logs and metrics for agent activity
- **Audit Trail**: Complete logging of all agent actions
- **MCP Integration**: Extensible tool system via Model Context Protocol

## Architecture

```
┌─────────────────────────────────────────────┐
│  Frontend (React + TypeScript)              │
│  - Agent Config  - Deploy  - Monitor        │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│  Backend API (Node.js + Fastify)            │
│  - Agent CRUD    - Event Router             │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│  Agent Runtime (Cloudflare/E2B Sandboxes)   │
│  - Claude Agent SDK                         │
│  - MCP Servers (Email, SMS, etc.)           │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│  Data Layer (PostgreSQL + Redis)            │
└─────────────────────────────────────────────┘
```

## Project Structure

```
claude-agent-studio/
├── backend/              # Backend API (Fastify)
├── agent-runtime/        # Agent runtime environment
├── mcp-servers/          # MCP server implementations
│   └── email/            # Email MCP server
├── frontend/             # React frontend
├── packages/
│   └── shared-types/     # Shared TypeScript types
└── docker-compose.yml    # Local development environment
```

## Getting Started

### Quick Deployment

Choose your deployment guide:

- **[SETUP.md](./SETUP.md)** - Step-by-step setup (recommended, 30 mins)
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Quick reference checklist
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive guide with troubleshooting

**Stack**: Vercel (frontend) + Railway (backend + workers) + Supabase (database + auth)

### For Local Development

**Prerequisites:**
- Node.js 20+
- Docker and Docker Compose
- Anthropic API key
- Supabase account (or use local PostgreSQL)

### Installation

1. Clone the repository:
```bash
cd claude-agent-studio
```

2. Install dependencies:
```bash
npm install
```

3. Start local services (PostgreSQL, Redis):
```bash
docker-compose up -d
```

4. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and add your configuration

# Agent Runtime
cp agent-runtime/.env.example agent-runtime/.env
# Edit agent-runtime/.env and add your ANTHROPIC_API_KEY

# MCP Email Server (optional)
cp mcp-servers/email/.env.example mcp-servers/email/.env
# Edit with your email credentials

# Frontend
cp frontend/.env.example frontend/.env
```

5. Generate and run database migrations:
```bash
cd backend
npm run db:generate
npm run db:migrate
```

6. Build shared types:
```bash
cd packages/shared-types
npm run build
```

### Running the Application

#### Development Mode

Open 3 terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Agent Worker:**
```bash
cd agent-runtime
npm run worker
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at: http://localhost:5173

### Production Build

```bash
# Build all packages
npm run build

# Start backend
cd backend
npm start

# Start agent worker
cd agent-runtime
npm start

# Serve frontend (or deploy to Vercel/Cloudflare Pages)
cd frontend
npm run preview
```

## Usage

### Creating an Agent

1. Navigate to the dashboard
2. Click "New Agent"
3. Configure:
   - Name and description
   - System prompt (agent's instructions)
   - Model (Claude Sonnet 4.5, Opus 4.5, or Haiku 4)
   - Deployment settings
4. Click "Create Agent"

### Deploying an Agent

1. Navigate to the agent detail page
2. Click "Deploy"
3. The agent will be deployed to a sandbox and start listening for events

### Example Agent Configuration

```json
{
  "name": "AP Invoice Processor",
  "description": "Processes vendor invoices from email",
  "system_prompt": "You are an Accounts Payable assistant. Monitor the inbox for vendor invoices, extract data, and upload to the ERP system.",
  "model": "claude-sonnet-4-5",
  "temperature": 0.2,
  "mcp_servers": [
    {
      "name": "email",
      "url": "http://mcp-email:3001",
      "permissions": ["read_inbox", "send_email"]
    }
  ],
  "deployment": {
    "type": "event-driven",
    "sandbox": "cloudflare",
    "auto_restart": true
  }
}
```

## MCP Servers

### Email Server

The email MCP server provides tools for agents to interact with email:

- `email_read_inbox` - Read recent emails
- `email_read_message` - Read a specific email
- `email_send` - Send an email
- `email_forward` - Forward an email

To run the email server:
```bash
cd mcp-servers/email
npm run dev
```

## Tech Stack

### Backend
- Fastify (API framework)
- Drizzle ORM (database)
- BullMQ (job queue)
- PostgreSQL (primary database)
- Redis (cache & queue)
- Zod (validation)

### Agent Runtime
- Claude Agent SDK
- Anthropic API
- MCP (Model Context Protocol)

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query
- Radix UI
- Tailwind CSS

## API Endpoints

### Agents
- `POST /api/agents` - Create agent
- `GET /api/agents` - List agents
- `GET /api/agents/:id` - Get agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `POST /api/agents/:id/deploy` - Deploy agent
- `POST /api/agents/:id/stop` - Stop agent

### Logs
- `GET /api/agents/:id/logs` - Get logs
- `WS /api/agents/:id/logs/stream` - Stream logs (WebSocket)

### Metrics
- `GET /api/agents/:id/metrics` - Get metrics

### Webhooks
- `POST /api/webhooks/event` - Generic event webhook
- `POST /api/webhooks/email` - Email event webhook

## Cost Estimates

### Development (MVP)
- Cloudflare Sandboxes: ~$5-15/month
- PostgreSQL (Neon): Free tier
- Redis (Upstash): Free tier
- **Total: $0-25/month**

### Production (10 Active Agents)
- Sandbox compute: ~$30-50/month
- PostgreSQL: $19/month
- Redis: $10/month
- Claude API: ~$45/month
- **Total: ~$110-130/month**

## Roadmap

### Phase 1 (Current)
- ✅ Core infrastructure
- ✅ Agent CRUD operations
- ✅ Basic deployment
- ✅ Frontend UI
- ✅ Email MCP server

### Phase 2 (Next)
- [ ] Cloudflare Sandboxes integration
- [ ] E2B integration
- [ ] Session persistence
- [ ] Advanced metrics
- [ ] Authentication

### Phase 3
- [ ] SMS MCP server
- [ ] Multiple agent coordination
- [ ] Neo4j graph memory
- [ ] Human-in-the-loop escalation

## Contributing

This is a private project. For questions or issues, please contact the maintainer.

## License

Proprietary - All rights reserved
