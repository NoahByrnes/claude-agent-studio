# Railway Service Configuration

## Configure Backend API Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Open the `claude-agent-studio` project
3. Click on the `backend-api` service
4. Go to **Settings** tab
5. Scroll to **Build** section:
   - **Build Command**: `npm run build:types && npm run build:backend`
6. Scroll to **Deploy** section:
   - **Start Command**: `npm run start:backend`
7. Enable **Public Networking** (should already be enabled)
8. Click **Deploy** to trigger a deployment

## Configure Worker Service

1. In the same project, click on the `claude-agent-studio` service
2. Go to **Settings** tab
3. Scroll to **Build** section:
   - **Build Command**: `npm run build:types && npm run build:runtime`
4. Scroll to **Deploy** section:
   - **Start Command**: `npm run start:worker`
5. **Do NOT** enable Public Networking (worker doesn't need it)
6. Click **Deploy** to trigger a deployment

## After Both Services Deploy

1. Go to backend-api service → **Settings** → **Networking**
2. Copy the **Public URL** (e.g., `https://backend-api-production-xxxx.up.railway.app`)
3. If you want a custom domain, add `api-studio.noahbyrnes.com` under **Custom Domain**
4. Test the health endpoint: `https://your-backend-url.up.railway.app/health`

## Environment Variables

✅ Already configured via CLI:
- Both services have all required environment variables
- Worker has `BACKEND_URL` set to internal Railway domain
- If you set up a custom domain for backend, update worker's `BACKEND_URL` to use it

## Next Steps

After Railway services are running:
1. Deploy frontend to Vercel
2. Configure custom domains (optional)
3. Test the full application
