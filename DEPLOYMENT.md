# Frontend Deployment — Vercel

## Stack

- **Framework** — React + Vite (static site)
- **Hosting** — Vercel
- **API** — Wearhaus Backend on Render (`VITE_API_URL`)
- **Payments** — Razorpay (public key only, safe to expose)

---

## Prerequisites

- GitHub account
- Vercel account → [vercel.com](https://vercel.com)
- Backend already deployed on Render ✅ (get the URL before deploying frontend)

Push `e-commerce-frontend` to GitHub before starting.

---

## Step 1 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo → select `e-commerce-frontend`
3. Vercel auto-detects Vite — confirm the settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Under **Environment Variables**, add:

```
VITE_API_URL=https://<your-backend>.onrender.com/api
VITE_RAZORPAY_KEY_ID=<your-razorpay-key-id>
```

5. Click **Deploy**
6. Wait ~1–2 minutes
7. Test: `https://<your-frontend>.vercel.app` → should load the Wearhaus homepage

---

## Step 2 — After deploy, update the backend

Once you have your Vercel URL, go back to Render and update:

```
CLIENT_URL=https://<your-frontend>.vercel.app
```

Then trigger a **Manual Deploy** on Render to apply the change.

This is required for:
- CORS — backend only accepts requests from `CLIENT_URL`
- Google OAuth redirect — `googleCallback` redirects to `CLIENT_URL/auth/callback`

---

## Step 3 — Register OAuth callback in Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Click your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   https://<your-frontend>.vercel.app
   ```
4. Under **Authorized redirect URIs**, confirm this is still set (from backend deploy):
   ```
   https://<your-backend>.onrender.com/api/auth/google/callback
   ```
5. Save

---

## Step 4 — Register Razorpay production domain (when going live)

If switching from test to live Razorpay keys:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com) → **Settings** → **Website/App Details**
2. Add your Vercel domain: `https://<your-frontend>.vercel.app`
3. Update `VITE_RAZORPAY_KEY_ID` in Vercel to your live key
4. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Render to your live keys

> **Note:** Razorpay test keys work on any domain — this step is only needed for production keys.

---

## How the API proxy works

**Local development:** Vite proxies `/api` → `http://localhost:5000` (configured in `vite.config.ts`). No `VITE_API_URL` needed locally.

**Production on Vercel:** There's no proxy. `VITE_API_URL` is used directly:
```ts
// client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```
All API calls go directly to `https://<your-backend>.onrender.com/api`.

---

## SPA Routing

`vercel.json` at the project root handles client-side routing — all routes are rewritten to `index.html` so direct URL access to `/shop`, `/orders/123`, `/admin` etc. works correctly:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Without this, refreshing any page other than `/` would return a 404.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Blank page after deploy | Build error | Check Vercel build logs for TypeScript/Vite errors |
| API calls fail (CORS error) | `CLIENT_URL` not updated on Render | Update `CLIENT_URL` in Render env vars → redeploy |
| Google OAuth fails after login | `GOOGLE_CALLBACK_URL` points to old URL | Verify it's set to the Render backend URL, not localhost |
| Direct URL access returns 404 | Missing `vercel.json` | Ensure `vercel.json` is committed and deployed |
| Razorpay modal doesn't open | Wrong `VITE_RAZORPAY_KEY_ID` | Check the key in Vercel env vars matches Razorpay dashboard |
| Refresh token cookie not sent | `withCredentials` not set | Already configured in `apiClient` — verify CORS on backend allows credentials |

---

## Quick Reference

| Service | URL |
|---|---|
| Frontend | `https://<your-frontend>.vercel.app` |
| Backend API | `https://<your-backend>.onrender.com/api` |
| Vercel Dashboard | [vercel.com/dashboard](https://vercel.com/dashboard) |
| Render Dashboard | [dashboard.render.com](https://dashboard.render.com) |
| Google Cloud Console | [console.cloud.google.com](https://console.cloud.google.com) |
| Razorpay Dashboard | [dashboard.razorpay.com](https://dashboard.razorpay.com) |

---

## Checklist

- [ ] Repo pushed to GitHub
- [ ] Deployed on Vercel — homepage loads
- [ ] `VITE_API_URL` set to Render backend URL
- [ ] `CLIENT_URL` updated on Render → redeployed
- [ ] Google OAuth — Authorized JavaScript origins updated in Google Cloud Console
- [ ] Test login, Google OAuth, checkout end to end
