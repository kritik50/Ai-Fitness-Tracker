# Fitness Tracker Deployment Guide

This project is split into:

- `client`: Vite + React frontend
- `server`: Strapi backend

## Recommended setup

Use:

- `Vercel` for the frontend
- `Render` for the Strapi backend
- `Render Postgres` for the production database

That matches the way this repo is structured today and avoids trying to run Strapi on a static host.

## What changed in the repo

- The backend now supports `PUBLIC_URL` for a live base URL.
- The backend now supports `CLIENT_URL` and `CORS_ORIGINS` for production CORS.
- The backend now includes the `pg` package, so it can connect to PostgreSQL.
- Both frontend and backend now have `.env.example` files for deployment.

## 1. Deploy the backend on Render

Create a new `Web Service` from the `server` directory.

Use these settings:

- Runtime: `Node`
- Root Directory: `server`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

Create a Render Postgres database and connect it to the backend.

Set these backend environment variables in Render:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
PUBLIC_URL=https://your-render-backend-url.onrender.com
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
CORS_ORIGINS=https://your-vercel-frontend-url.vercel.app
DATABASE_CLIENT=postgres
DATABASE_URL=<render-postgres-internal-connection-string>
APP_KEYS=<comma-separated-random-values>
API_TOKEN_SALT=<random-secret>
ADMIN_JWT_SECRET=<random-secret>
TRANSFER_TOKEN_SALT=<random-secret>
JWT_SECRET=<random-secret>
ENCRYPTION_KEY=<random-secret>
GEMINI_API_KEY=<your-gemini-api-key>
```

Notes:

- `PORT=10000` matches Render's default web-service port.
- Keep `DATABASE_URL` from Render's Postgres instance.
- The Strapi admin will be available at `https://your-render-backend-url.onrender.com/admin`.

## 2. First production backend setup

After the backend is live:

1. Open `/admin`
2. Create the first Strapi admin account
3. Re-enable the API permissions you configured locally

Under `Settings -> Users & Permissions Plugin`, enable the same permissions you used locally:

- `food-log`: `find`, `findOne`, `create`, `update`, `delete`
- `activity-log`: `find`, `findOne`, `create`, `update`, `delete`
- `ai-coach`: `insight`
- `image-analysis`: `analyze`
- `profile`: whatever authenticated actions your app needs enabled in production

If user signup should stay available, also re-enable registration in:

- `Settings -> Users & Permissions Plugin -> Advanced Settings`

## 3. Deploy the frontend on Vercel

Create a Vercel project from the `client` directory.

Use these settings:

- Root Directory: `client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Set this frontend environment variable in Vercel:

```env
VITE_STRAPI_API_URL=https://your-render-backend-url.onrender.com
```

Then redeploy the frontend after saving the variable.

## 4. Production checklist

- Backend opens at `https://...onrender.com/admin`
- Frontend opens at `https://...vercel.app`
- New users can register and log in
- Food logs save and load
- Activity logs save and load
- Profile/onboarding saves correctly
- AI coach works with `GEMINI_API_KEY` configured
- Browser console shows no CORS errors

## 5. Important Strapi note

Strapi does not let you edit content types from the production admin the same way you do in development. Make schema changes locally, commit them, and redeploy.
