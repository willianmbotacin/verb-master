# VerbMaster

Irregular English verb practice: pick a column, spin for a verb, quiz against the clock, then review results. Built with **Next.js 16**, **MUI**, and a **PWA** (service worker in production builds).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build (includes PWA assets under `public/`):

```bash
npm run build
npm start
```

## Deploy to GitHub

1. Create a new empty repository on GitHub (no README/license if you already have them here).
2. In this folder:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Use SSH instead of HTTPS if you prefer: `git@github.com:YOUR_USER/YOUR_REPO.git`.

## Deploy to Netlify

1. Sign in at [Netlify](https://app.netlify.com/) and choose **Add new site** → **Import an existing project**.
2. Connect **GitHub** and select this repository.
3. Netlify should detect **Next.js** automatically. Confirm:
   - **Build command:** `npm run build` (already set in `netlify.toml`)
   - **Node:** 22 (set via `netlify.toml`)
4. Deploy. After the first build, open the site URL Netlify assigns (or attach a custom domain under **Domain settings**).

The `netlify.toml` file pins Node 22 and the build command so CI matches local production builds.
