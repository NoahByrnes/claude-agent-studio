# Vercel Frontend Deployment

## Quick Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import `claude-agent-studio` from GitHub
4. Configure the following:

### Framework & Build Settings

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (default)

### Environment Variables

Add these in the **Environment Variables** section:

```
VITE_SUPABASE_URL=https://qilqdedyvjbqshyknavy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_M1UrMJR1rbSeGLWiNCtz0Q_AKLGxPcp
```

**For VITE_API_BASE**, use one of these options:

**Option 1: Railway public URL (if backend-api is deployed)**
```
VITE_API_BASE=https://your-backend-url.up.railway.app
```

**Option 2: Custom domain (if you set up api-studio.noahbyrnes.com)**
```
VITE_API_BASE=https://api-studio.noahbyrnes.com
```

**Option 3: Vercel proxy (recommended - already configured in vercel.json)**
```
VITE_API_BASE=/api
```

> **Recommendation**: Use Option 3 (`/api`) since the `frontend/vercel.json` is already configured to proxy `/api/*` requests to your backend. This way you don't need to update CORS settings or deal with cross-origin issues.

### Deploy

5. Click **Deploy**
6. Wait for deployment to complete (~2-3 minutes)

### Custom Domain (Optional)

1. After deployment, go to **Settings** → **Domains**
2. Add: `studio.noahbyrnes.com`
3. Follow Vercel's DNS instructions
4. Update your Squarespace DNS:
   - **Type**: CNAME
   - **Host**: `studio`
   - **Points to**: `cname.vercel-dns.com`

### Update CORS (Important!)

After frontend is deployed, you need to update the backend's `CORS_ORIGIN` environment variable:

1. Go to Railway → backend-api service → Variables
2. Update `CORS_ORIGIN` to your Vercel URL:
   - If using default: `https://your-project.vercel.app`
   - If using custom domain: `https://studio.noahbyrnes.com`
3. Redeploy the backend service

## Testing

After both deployments:
1. Visit your frontend URL
2. Try signing up (should create a Supabase auth user)
3. Try logging in
4. Try creating a test agent

## Troubleshooting

**Error: Network request failed**
- Check that `VITE_API_BASE` is correct
- Verify backend is running (check Railway logs)
- Verify `CORS_ORIGIN` in backend matches your frontend URL

**Error: Unauthorized / 401**
- Verify Supabase credentials in both frontend and backend
- Check browser Network tab for auth tokens being sent

**Build fails**
- Verify all frontend dependencies are in `frontend/package.json`
- Check Vercel build logs for specific errors
