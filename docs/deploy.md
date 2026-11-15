# Deploying to Vercel

The site is a Next.js app, so it runs on any Node host. Vercel is the path the
upstream Whop template documents; Whop's own `whop apps deploy` only runs Vite
builds and cannot serve this app.

## Environment variables

Set these in the Vercel project (Production and Preview):

| Name | Notes |
| --- | --- |
| `WHOP_API_KEY` | account API key, server-side only |
| `WHOP_WEBHOOK_SECRET` | the `ws_…` signing secret of the production webhook |
| `NEXT_PUBLIC_WHOP_APP_ID` | `app_…` |
| `WHOP_API_BASE` | `https://api.whop.com/api/v1` |
| `WHOP_API_VERSION_DATE` | e.g. `2026-11-04-1` |
| `OPENSHORTS_API_URL` | only needed by the free tools; see below |

Local development reads the same names from `.env.local` (git-ignored).

## Deploy

```bash
vercel link --yes          # once
vercel --yes               # preview
vercel --yes --prod        # production
```

Vercel runs `pnpm install` with a frozen lockfile, so keep `pnpm-lock.yaml`
committed and in sync with `package.json`.

## After the first deploy

1. Whop dashboard → the app → **Hosting**: set Base URL to the production
   domain, experience path `/experiences/[experienceId]`, dashboard path
   `/dashboard/[companyId]`, discover path `/discover`.
2. **Webhooks**: create one pointing at `https://<domain>/api/webhooks`, subscribe
   to the events you handle, copy its `ws_…` into `WHOP_WEBHOOK_SECRET`, redeploy.
3. Install the app into a test company and open it inside Whop. `/dashboard/…`
   and `/experiences/…` return 500 outside the Whop iframe by design — they need
   the `x-whop-user-token` header Whop injects.

## Free tools

`/api/tools/{youtube-transcript,tiktok-transcript,youtube-metadata}` proxy an
OpenShorts backend (`OPENSHORTS_API_URL`). With that variable unset they fall back
to `127.0.0.1:8000` and answer 502. Either deploy the backend and set the
variable, or replace the proxies with Node implementations.
