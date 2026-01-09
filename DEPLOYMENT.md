# Deployment Guide

This guide will walk you through deploying Claude Agent Studio to your production infrastructure using:
- **Vercel** for frontend hosting
- **Railway** for backend API + agent workers
- **Supabase** for PostgreSQL database + authentication
- **Upstash** for Redis (or Railway Redis)
- **Squarespace** for domain management

## Architecture Overview

```
studio.noahbyrnes.com (Frontend)
    ↓
api-studio.noahbyrnes.com (Backend + Workers on Railway)
    ↓
Supabase PostgreSQL + Auth
    ↓
Upstash Redis (or Railway Redis)
```

## Prerequisites

1. **Supabase Account**: Already set up
2. **Vercel Account**: Free tier available
3. **Railway Account**: Free tier ($5/month credit)
4. **Upstash Account**: Free tier (10K commands/day) OR use Railway Redis addon
5. **Anthropic API Key**: For Claude agents
6. **Domain Access**: Squarespace DNS management

---

## Part 1: Supabase Setup

### 1.1 Create Database Tables

In your Supabase project SQL editor, run the migrations:

```bash
cd backend
npm run db:generate
# Copy the generated SQL from db/migrations and run in Supabase SQL editor
```

Or manually create tables from `backend/db/schema.ts`.

### 1.2 Enable Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Configure email templates (optional)
4. Note your **Project URL** and **Anon Key**

### 1.3 Get Connection Details

From Supabase Dashboard → Project Settings → Database:
- **Database URL** (for Drizzle ORM)
- **Connection pooling URL** (recommended for serverless)

---

## Part 2: Redis Setup

### Option A: Upstash Redis (Recommended)

1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Select a region close to your Railway deployment
4. Copy the **REDIS_URL** (format: `redis://default:password@host:port`)

### Option B: Railway Redis

1. In your Railway project, click **+ New**
2. Select **Add Redis**
3. Copy the connection string from Redis service variables

---

## Part 3: Railway Deployment (Backend + Workers)

### 3.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Connect your GitHub account and select this repository
4. Railway will detect the monorepo structure

### 3.2 Configure Service

1. **Root Directory**: Leave as `/` (monorepo root)
2. **Build Command**: `npm run build:types && npm run build:backend && npm run build:runtime`
3. **Start Command**: Choose ONE of:
   - **API only**: `npm run start:backend`
   - **Worker only**: `npm run start:worker`
   - **Both (not recommended)**: Use PM2 (see below)

### 3.3 Run Both API + Worker (Recommended: Separate Services)

**Best Practice**: Create TWO Railway services from the same repo:

**Service 1: Backend API**
- Start Command: `npm run start:backend`
- Expose public port (Railway will give you a URL)

**Service 2: Agent Worker**
- Start Command: `npm run start:worker`
- No public port needed (background worker)

### 3.4 Set Environment Variables

In Railway project settings, add these variables for **BOTH services**:

```bash
# Server
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://studio.noahbyrnes.com

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:6543/postgres?pgbouncer=true

# Redis (Upstash or Railway)
REDIS_URL=redis://default:[password]@[host]:6379

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Backend URL (for worker to communicate with API)
BACKEND_URL=https://your-railway-app.railway.app
```

### 3.5 Get Railway URL

After deployment, Railway will provide a URL like:
```
https://your-service-production.up.railway.app
```

Save this - you'll need it for frontend configuration.

### 3.6 Custom Domain (Optional but Recommended)

1. In Railway service settings → **Domains**
2. Click **Custom Domain**
3. Add: `api-studio.noahbyrnes.com`
4. Railway will provide DNS records
5. Add these records in Squarespace DNS settings (see Part 5)

---

## Part 4: Vercel Deployment (Frontend)

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **Root Directory**: `frontend`
5. **Framework Preset**: Vite

### 4.2 Configure Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4.3 Set Environment Variables

In Vercel project settings → Environment Variables:

```bash
# Point to your Railway backend
VITE_API_BASE=https://api-studio.noahbyrnes.com
# Or if not using custom domain:
# VITE_API_BASE=https://your-railway-app.railway.app/api

# Supabase (same as backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4.4 Update Proxy Config

If using Railway URL directly, update `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-app.railway.app/api/$1"
    }
  ]
}
```

### 4.5 Deploy

Click **Deploy** - Vercel will build and deploy your frontend.

### 4.6 Get Vercel URL

Vercel will provide a URL like:
```
https://your-project.vercel.app
```

---

## Part 5: Domain Configuration (Squarespace)

### 5.1 Frontend Domain

**Option A: Use Subdomain**

In Squarespace DNS settings, add a CNAME record:
- **Host**: `studio`
- **Points to**: `cname.vercel-dns.com`
- **TTL**: Automatic

**Option B: Use Custom Domain in Vercel**

1. In Vercel project → **Domains**
2. Add `studio.noahbyrnes.com`
3. Follow Vercel's DNS instructions for Squarespace

### 5.2 Backend Domain (If Using Custom Domain)

In Squarespace DNS settings, add records provided by Railway:
- Usually a CNAME record pointing to Railway's domain

### 5.3 Update CORS

After configuring domains, update Railway environment variable:
```bash
CORS_ORIGIN=https://studio.noahbyrnes.com
```

Redeploy the backend service.

---

## Part 6: Post-Deployment Configuration

### 6.1 Test Authentication

1. Visit `https://studio.noahbyrnes.com`
2. Click **Sign up** and create an account
3. Check Supabase Dashboard → Authentication → Users to verify

### 6.2 Verify API Connection

In browser console on your frontend:
```javascript
fetch('https://api-studio.noahbyrnes.com/health')
  .then(r => r.json())
  .then(console.log)
// Should return: {status: 'ok', timestamp: '...'}
```

### 6.3 Create First Agent

1. Log in to your deployed app
2. Click **New Agent**
3. Configure and deploy
4. Check Railway logs to see worker processing

### 6.4 Monitor Services

**Railway**:
- Dashboard → your project → Metrics
- View logs for both API and worker services

**Vercel**:
- Dashboard → your project → Analytics
- View function logs and deployment logs

**Supabase**:
- Dashboard → Database → Table Editor (view agents, logs)
- Dashboard → Authentication → Users

---

## Part 7: Cost Estimates

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited projects
- **Railway**: $5/month free credit (covers ~1 small service)
- **Supabase**: 500MB database, 2GB bandwidth
- **Upstash**: 10K Redis commands/day

### Expected Costs (Light Usage)
- **Railway**: $5-15/month (API + worker)
- **Upstash**: Free tier sufficient
- **Claude API**: ~$10-50/month (depends on agent usage)
- **Total**: $15-65/month

### Scaling Up (10 Active Agents)
- **Railway**: $20-40/month
- **Supabase**: $25/month (Pro plan)
- **Upstash**: $10/month (beyond free tier)
- **Claude API**: $50-150/month
- **Total**: $105-215/month

---

## Part 8: Troubleshooting

### Frontend Can't Connect to Backend

1. Check `VITE_API_BASE` environment variable in Vercel
2. Verify CORS_ORIGIN in Railway matches your frontend domain
3. Check Railway service is running (not crashed)
4. Look at browser Network tab for actual error

### Authentication Not Working

1. Verify Supabase URL and keys match in both frontend and backend
2. Check Supabase Dashboard → Authentication → Settings
3. Ensure email provider is enabled
4. Check browser console for Supabase errors

### Database Connection Failed

1. Verify DATABASE_URL in Railway
2. Check Supabase connection pooler is enabled (port 6543)
3. Test connection from Railway using Supabase's connection test
4. Ensure IP allowlist in Supabase allows all IPs (for Railway)

### Worker Not Processing Events

1. Check Railway logs for worker service
2. Verify REDIS_URL is correct in both API and worker
3. Check BullMQ dashboard: `npx bull-board` (if enabled)
4. Ensure BACKEND_URL in worker points to correct API

### Agent Deployment Failing

1. Check Railway worker logs for errors
2. Verify ANTHROPIC_API_KEY is set correctly
3. Check agent configuration in database
4. Look for sandbox service errors (Cloudflare/E2B)

---

## Part 9: Security Checklist

- [ ] Supabase Row Level Security (RLS) enabled
- [ ] Service role key only in backend (never in frontend)
- [ ] CORS configured to only allow your domain
- [ ] API authentication middleware active on all routes
- [ ] Environment variables never committed to git
- [ ] Anthropic API key restricted (if possible)
- [ ] Database backups enabled in Supabase
- [ ] HTTPS enforced on all services

---

## Part 10: Maintenance

### Updating the Application

1. **Push to GitHub**: Changes automatically deploy via Railway and Vercel
2. **Database Migrations**: Run in Supabase SQL editor
3. **Environment Variables**: Update in Railway/Vercel dashboards

### Monitoring

- Set up Railway alerts for service crashes
- Monitor Supabase database size
- Track Anthropic API costs
- Review agent logs regularly

### Backups

- Supabase: Auto-backups on Pro plan, manual exports on free tier
- Export agent configurations regularly
- Keep Redis data ephemeral (don't rely on it for persistence)

---

## Quick Reference

### URLs
- Frontend: `https://studio.noahbyrnes.com`
- Backend API: `https://api-studio.noahbyrnes.com`
- Health Check: `https://api-studio.noahbyrnes.com/health`

### Services
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Upstash Dashboard**: https://console.upstash.com

### Support
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support
- Upstash: https://upstash.com/docs

---

**Next Steps**: Follow this guide step-by-step, and you'll have your Claude Agent Studio running on `studio.noahbyrnes.com` with full authentication and agent management capabilities!
