# Claude Agent Studio - Production Setup

Quick setup guide for deploying to your existing infrastructure.

## Prerequisites

- GitHub repo pushed
- Supabase account (you already have one!)
- Vercel account (you already have one!)
- Railway account (sign up at railway.app)
- Anthropic API key

---

## Part 1: Supabase Setup (5 minutes)

### 1. Create New Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Name: `claude-agent-studio`
4. Database password: (create strong password)
5. Region: Same as your other projects
6. Wait ~2 minutes for provisioning

### 2. Run Database Schema

1. In Supabase dashboard → **SQL Editor**
2. Click **New Query**
3. Copy contents from `supabase/schema.sql`
4. Paste and click **Run**
5. Should see: "Success. No rows returned"

### 3. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Customize email templates in **Email Templates**

### 4. Get API Credentials

In **Settings** → **API**, copy:
- **Project URL**: `https://xxxxx.supabase.co`
- **anon public** key: `eyJxxx...`
- **service_role** key: `eyJxxx...` (keep secret!)

Also get **Database URL** from **Settings** → **Database** → **Connection string** → **URI** (use connection pooling port 6543)

---

## Part 2: Railway Setup (Backend + Worker) (10 minutes)

### 1. Create New Project

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Authenticate GitHub and select `claude-agent-studio` repo
4. Railway will detect it's a Node.js project

### 2. Create Backend API Service

First service (API):
1. After importing, configure:
   - **Service Name**: `backend-api`
   - **Root Directory**: `/` (monorepo root)
   - **Build Command**: `npm run build:types && npm run build:backend`
   - **Start Command**: `npm run start:backend`
2. **Settings** → **Networking** → Enable **Public Networking**
3. Copy the provided URL (e.g., `https://xxx.up.railway.app`)

### 3. Add Environment Variables (Backend API)

In Railway service **Variables** tab, add:

```
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://studio.noahbyrnes.com

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true

ANTHROPIC_API_KEY=sk-ant-xxx
```

### 4. Add Redis

In Railway project:
1. Click **+ New** → **Database** → **Add Redis**
2. Once created, copy the `REDIS_URL` from Redis service variables
3. Add `REDIS_URL` to both backend and worker services

### 5. Create Worker Service

1. In same Railway project → **+ New** → **GitHub Repo** (same repo)
2. Configure:
   - **Service Name**: `agent-worker`
   - **Root Directory**: `/`
   - **Build Command**: `npm run build:types && npm run build:runtime`
   - **Start Command**: `npm run start:worker`
3. Add same environment variables as backend API, PLUS:
   - `BACKEND_URL=https://your-backend-api-url.railway.app`

### 6. Optional: Custom Domain for Backend

1. In backend service → **Settings** → **Networking** → **Custom Domain**
2. Add: `api-studio.noahbyrnes.com`
3. Railway will provide DNS instructions
4. Add DNS records in Squarespace (see Part 4)

---

## Part 3: Vercel Setup (Frontend) (5 minutes)

### 1. Import Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import `claude-agent-studio` from GitHub

### 2. Configure Build

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Add Environment Variables

In Vercel project **Settings** → **Environment Variables**:

```
VITE_API_BASE=https://api-studio.noahbyrnes.com
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> If not using custom domain yet, use Railway URL:
> `VITE_API_BASE=https://your-backend.railway.app/api`

### 4. Update vercel.json

Before deploying, update `frontend/vercel.json` with your Railway URL:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend.railway.app/api/$1"
    }
  ]
}
```

### 5. Add Custom Domain

1. In Vercel project → **Settings** → **Domains**
2. Add: `studio.noahbyrnes.com`
3. Vercel will provide DNS instructions

---

## Part 4: Squarespace DNS Configuration (5 minutes)

### Frontend (studio.noahbyrnes.com)

Add CNAME record from Vercel instructions:
- **Host**: `studio`
- **Points to**: `cname.vercel-dns.com`
- **TTL**: Auto

### Backend (api-studio.noahbyrnes.com) - Optional

Add records from Railway instructions (usually CNAME or A record)

**Wait 10-60 minutes for DNS propagation**

---

## Part 5: Verify Deployment (2 minutes)

### 1. Test Backend Health

Visit: `https://api-studio.noahbyrnes.com/health`

Should return:
```json
{"status":"ok","timestamp":"2025-01-09T..."}
```

### 2. Test Frontend

Visit: `https://studio.noahbyrnes.com`

Should see login page.

### 3. Create Account

1. Click **Sign up**
2. Enter email and password
3. Check email for verification (if enabled in Supabase)
4. Log in and create your first agent!

---

## Troubleshooting

### Frontend shows connection error
- Check `VITE_API_BASE` in Vercel environment variables
- Verify `CORS_ORIGIN` in Railway matches frontend domain
- Check Railway backend service is running

### Can't sign up/login
- Verify Supabase credentials in Vercel
- Check email provider is enabled in Supabase
- Look at browser console for errors

### Backend 401 errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` in Railway
- Check tokens are being sent from frontend (Network tab)

### Worker not processing
- Check Railway worker service logs
- Verify `REDIS_URL` is set in both services
- Verify `BACKEND_URL` points to correct API

---

## Cost Summary

**Expected Monthly Costs:**
- Railway: $5-15 (free tier credit covers light usage)
- Supabase: Free tier (500MB DB)
- Vercel: Free tier
- Redis: Included with Railway
- Claude API: ~$10-50 (depends on usage)

**Total: $15-65/month for production**

---

## Next Steps

1. Set up monitoring in Railway dashboard
2. Configure Supabase backups
3. Add more agent types
4. Deploy MCP email server
5. Monitor costs in Anthropic dashboard

**Your app should now be live at `studio.noahbyrnes.com`!** 🎉
