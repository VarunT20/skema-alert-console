# AML SKeMa alert console — deploy guide

## What's in this folder
- `index.html` — the alert console (login gate, admin webhook config, free-form alert form)
- `api/relay.js` — a Vercel serverless function that forwards requests to Workato server-to-server, avoiding browser CORS restrictions entirely

## Deploy to Vercel

**Option A — CLI (fastest if Node is installed)**
1. Install the Vercel CLI once: `npm i -g vercel`
2. From inside this folder, run: `vercel`
3. Follow the prompts (log in / create account if needed, accept defaults for project name and settings)
4. Vercel prints a live URL when done, e.g. `https://skema-alert-console.vercel.app`

**Option B — Dashboard (no terminal)**
1. Go to vercel.com and sign in (GitHub login is quickest)
2. Drag this whole folder onto the "Add New Project" screen, or push it to a GitHub repo first and import that repo
3. Click Deploy — no configuration needed, Vercel auto-detects the static `index.html` and the `api/` function

## After deploying
- Open the printed URL — the console should load and work immediately, since the relay lives at `/api/relay` on the same domain (no CORS setup needed).
- Login: User ID `analyst`, password `skema2026` (change these directly in `index.html` if you want different credentials — search for `CREDENTIALS`).
- If Workato's webhook URL ever changes, update the `WORKATO_WEBHOOK_URL` constant at the top of `api/relay.js` and redeploy (`vercel --prod` or push again).
