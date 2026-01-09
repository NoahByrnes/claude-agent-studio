# Quick Start - Deploy to Your Domain

A streamlined checklist to get Claude Agent Studio running on `studio.noahbyrnes.com`.

## Pre-Deployment Checklist

- [ ] Supabase project created with database
- [ ] Anthropic API key ready
- [ ] GitHub repository pushed
- [ ] Railway account created
- [ ] Vercel account created
- [ ] Upstash account created (or will use Railway Redis)

---

## 1. Supabase Setup (5 minutes)

1. Create tables using SQL from `backend/db/schema.ts` OR
2. Run migrations:
   ```bash
   cd backend
   npm install
   npm run db:generate
   # Copy SQL to Supabase SQL Editor and run
   ```

3. Enable Email Auth:
   - Dashboard → Authentication → Providers → Enable Email

4. Collect credentials:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon Key**: From Settings → API
   - **Service Role Key**: From Settings → API
   - **Database URL**: From Settings → Database → Connection string

---

## 2. Redis Setup (2 minutes)

**Upstash:**
1. Create Redis database at upstash.com
2. Copy **REDIS_URL**

**OR Railway Redis:**
- Add Redis addon after Railway setup (Step 3)

---

## 3. Railway Deployment (10 minutes)

### Backend API Service

1. New Project → Deploy from GitHub repo
2. Select this repository
3. Configure:
   - **Build**: `npm run build:types && npm run build:backend`
   - **Start**: `npm run start:backend`
   - **Enable Public Network**

4. Add Environment Variables (see DEPLOYMENT.md Part 3.4)

5. Save Railway URL: `https://xxx.up.railway.app`

### Worker Service

1. In same project → **New Service** → Same GitHub repo
2. Configure:
   - **Build**: `npm run build:types && npm run build:runtime`
   - **Start**: `npm run start:worker`
   - **No public network needed**

3. Add same environment variables as API service

### Optional: Custom Domain

1. Railway service settings → Domains → Custom Domain
2. Add `api-studio.noahbyrnes.com`
3. Follow DNS instructions (next section)

---

## 4. Vercel Deployment (5 minutes)

1. Import GitHub repo
2. **Root Directory**: `frontend`
3. **Framework**: Vite

4. Environment Variables:
   ```bash
   VITE_API_BASE=https://api-studio.noahbyrnes.com
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Deploy

6. Add custom domain `studio.noahbyrnes.com` in Vercel settings

---

## 5. Squarespace DNS (5 minutes)

### Frontend (studio.noahbyrnes.com)
Add CNAME record:
- **Host**: `studio`
- **Points to**: (from Vercel domain settings)

### Backend (api-studio.noahbyrnes.com) - If using custom domain
Add records from Railway domain settings

**Wait 10-60 minutes for DNS propagation**

---

## 6. Verify Deployment (2 minutes)

1. **Health Check**:
   ```
   https://api-studio.noahbyrnes.com/health
   Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Frontend**: Visit `https://studio.noahbyrnes.com`

3. **Sign Up**: Create your first account

4. **Create Agent**: Test agent creation

---

## Environment Variables Reference

### Backend & Worker (Railway)
```bash
# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://studio.noahbyrnes.com

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true

# Redis
REDIS_URL=redis://default:pass@host:6379

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Worker needs this
BACKEND_URL=https://api-studio.noahbyrnes.com
```

### Frontend (Vercel)
```bash
VITE_API_BASE=https://api-studio.noahbyrnes.com
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Troubleshooting

**Frontend shows "Loading..." forever**
- Check Supabase credentials in Vercel
- Check browser console for errors

**Can't sign in**
- Verify Supabase Email provider is enabled
- Check Supabase Dashboard → Authentication → Users

**API returns 401 Unauthorized**
- Check Supabase service role key in Railway
- Verify auth middleware is working (Railway logs)

**Agents not processing**
- Check Railway worker service logs
- Verify Redis connection in both services
- Check BullMQ queue status

---

## What's Next?

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed information
- Set up monitoring and alerts
- Configure Supabase Row Level Security
- Add more agent types
- Integrate additional MCP servers (SMS, etc.)

**Your app should now be live at `studio.noahbyrnes.com`!** 🎉
