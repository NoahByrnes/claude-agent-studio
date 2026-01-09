# Deployment Checklist

Quick reference for deploying Claude Agent Studio to production.

## 1. Supabase

- [ ] Create new project: `claude-agent-studio`
- [ ] Run SQL: Copy `supabase/schema.sql` → SQL Editor → Run
- [ ] Enable Email Auth: Authentication → Providers → Email ✓
- [ ] Copy credentials:
  - [ ] Project URL: `https://_____.supabase.co`
  - [ ] Anon key: `eyJ_____`
  - [ ] Service role key: `eyJ_____`
  - [ ] Database URL (with :6543 pooling): `postgresql://postgres:___@db.___.supabase.co:6543/postgres?pgbouncer=true`

## 2. Railway (Backend + Worker)

### Backend API Service
- [ ] New Project → Deploy from GitHub → `claude-agent-studio`
- [ ] Service name: `backend-api`
- [ ] Build: `npm run build:types && npm run build:backend`
- [ ] Start: `npm run start:backend`
- [ ] Enable Public Networking
- [ ] Copy Railway URL: `https://_____.railway.app`

### Add Redis
- [ ] + New → Database → Redis
- [ ] Copy Redis URL: `redis://default:___@___:6379`

### Backend Environment Variables
```
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://studio.noahbyrnes.com

SUPABASE_URL=https://_____.supabase.co
SUPABASE_ANON_KEY=eyJ_____
SUPABASE_SERVICE_ROLE_KEY=eyJ_____
DATABASE_URL=postgresql://postgres:___@db.___.supabase.co:6543/postgres?pgbouncer=true

REDIS_URL=redis://default:___@___:6379
ANTHROPIC_API_KEY=sk-ant-_____
```

### Worker Service
- [ ] + New → GitHub Repo (same repo)
- [ ] Service name: `agent-worker`
- [ ] Build: `npm run build:types && npm run build:runtime`
- [ ] Start: `npm run start:worker`
- [ ] Add same env vars as backend PLUS:
  - [ ] `BACKEND_URL=https://_____.railway.app`

### Custom Domain (Optional)
- [ ] Backend service → Settings → Networking → Custom Domain
- [ ] Add: `api-studio.noahbyrnes.com`
- [ ] Follow DNS instructions

## 3. Vercel (Frontend)

- [ ] Import project: `claude-agent-studio`
- [ ] Framework: Vite
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables
```
VITE_API_BASE=https://api-studio.noahbyrnes.com
VITE_SUPABASE_URL=https://_____.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ_____
```

### Custom Domain
- [ ] Settings → Domains → Add `studio.noahbyrnes.com`
- [ ] Follow DNS instructions

## 4. Squarespace DNS

### Frontend (studio.noahbyrnes.com)
- [ ] Add CNAME:
  - Host: `studio`
  - Points to: (from Vercel instructions)

### Backend (api-studio.noahbyrnes.com)
- [ ] Add records from Railway instructions

## 5. Verify

- [ ] Health check: `https://api-studio.noahbyrnes.com/health`
- [ ] Frontend loads: `https://studio.noahbyrnes.com`
- [ ] Sign up works
- [ ] Create test agent

---

## Quick Deploy Commands

```bash
# If you update code, push to GitHub:
git add -A
git commit -m "Update"
git push

# Railway and Vercel auto-deploy from main branch
```

---

## URLs Reference

- **Frontend**: https://studio.noahbyrnes.com
- **Backend API**: https://api-studio.noahbyrnes.com
- **Health Check**: https://api-studio.noahbyrnes.com/health
- **Supabase Dashboard**: https://supabase.com/dashboard/project/_____
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Estimated Time: 30 minutes

- Supabase: 5 min
- Railway: 10 min
- Vercel: 5 min
- DNS: 5 min (+ wait for propagation)
- Testing: 5 min
