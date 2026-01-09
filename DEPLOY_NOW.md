# Deploy Claude Agent Studio - Quick Start

All preparation is complete! Follow these steps to deploy.

## Status: Ready to Deploy ✅

- ✅ Code pushed to GitHub: [NoahByrnes/claude-agent-studio](https://github.com/NoahByrnes/claude-agent-studio)
- ✅ Railway project created: `claude-agent-studio`
- ✅ Backend API service added with all environment variables
- ✅ Worker service added with all environment variables
- ✅ Redis database provisioned
- ✅ Supabase project created and schema loaded

## Step 1: Deploy Railway Services (5 minutes)

**Backend API Service:**
1. Open [Railway Dashboard](https://railway.app/dashboard) → `claude-agent-studio` project
2. Click `backend-api` service → **Settings**
3. Set **Build Command**: `npm run build:types && npm run build:backend`
4. Set **Start Command**: `npm run start:backend`
5. Verify **Public Networking** is enabled
6. Click **Deploy** button

**Worker Service:**
1. Click `claude-agent-studio` service → **Settings**
2. Set **Build Command**: `npm run build:types && npm run build:runtime`
3. Set **Start Command**: `npm run start:worker`
4. Click **Deploy** button

Wait ~3-5 minutes for both services to build and deploy.

## Step 2: Get Backend URL

1. Go to `backend-api` service
2. Click **Settings** → **Networking**
3. Copy the **Public URL** (e.g., `backend-api-production-xxxx.up.railway.app`)
4. Test it: `https://your-backend-url/health` (should return `{"status":"ok"}`)

## Step 3: Deploy Frontend to Vercel (3 minutes)

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. **Add New** → **Project** → Import `claude-agent-studio`
3. **Configure:**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
4. **Add Environment Variables:**
   ```
   VITE_API_BASE=/api
   VITE_SUPABASE_URL=https://qilqdedyvjbqshyknavy.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_M1UrMJR1rbSeGLWiNCtz0Q_AKLGxPcp
   ```
5. Click **Deploy**

Wait ~2 minutes for build and deployment.

## Step 4: Update Backend CORS (Important!)

After Vercel deploys, update the backend to allow frontend requests:

1. Copy your Vercel URL (e.g., `https://claude-agent-studio.vercel.app`)
2. Go to Railway → `backend-api` → **Variables**
3. Update `CORS_ORIGIN` variable:
   - Change from: `https://studio.noahbyrnes.com`
   - Change to: Your actual Vercel URL
4. Click **Redeploy** on backend-api

## Step 5: Test the Application

1. Open your Vercel frontend URL
2. Click **Sign Up**
3. Create an account (check email for verification if enabled)
4. Log in
5. Try creating a test agent
6. Check Railway logs to see backend activity

## Optional: Custom Domains

### Frontend: studio.noahbyrnes.com

1. Vercel → **Settings** → **Domains** → Add `studio.noahbyrnes.com`
2. Add CNAME record in Squarespace DNS:
   - Host: `studio`
   - Points to: `cname.vercel-dns.com`
3. After domain is active, update backend CORS_ORIGIN to `https://studio.noahbyrnes.com`

### Backend: api-studio.noahbyrnes.com

1. Railway → backend-api → **Settings** → **Networking** → **Custom Domain**
2. Add: `api-studio.noahbyrnes.com`
3. Follow Railway's DNS instructions
4. Add records to Squarespace DNS

## Troubleshooting

**Backend won't start:**
- Check Railway logs: `railway logs --service backend-api`
- Verify DATABASE_URL has correct password
- Verify Supabase credentials

**Frontend can't reach backend:**
- Verify CORS_ORIGIN matches frontend URL exactly
- Check frontend Network tab for API requests
- Verify vercel.json proxy configuration

**Database connection errors:**
- Verify Supabase database password is correct
- Check if you're using port 6543 (connection pooling)
- Verify Supabase project is active

**Worker not processing events:**
- Check Railway logs: `railway logs --service claude-agent-studio`
- Verify BACKEND_URL is set correctly
- Verify Redis connection

## Expected Costs

**Monthly:**
- Railway: $5-15 (free tier $5 credit)
- Supabase: Free (500MB database)
- Vercel: Free
- Claude API: $10-50 (usage-based)

**Total: $15-65/month**

---

## Summary

You're ready to deploy! The entire process should take about 15 minutes:
- Railway backend + worker: ~8 minutes (build + deploy)
- Vercel frontend: ~3 minutes (build + deploy)
- Configuration and testing: ~4 minutes

Your application will be live at your Vercel URL, with all services communicating securely through Supabase auth and Railway networking.

**Need help?** Check RAILWAY_CONFIG.md and VERCEL_CONFIG.md for detailed instructions.
