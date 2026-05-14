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

**Production:** https://verb-master-train.netlify.app

The `netlify.toml` file pins Node 22 and the build command so CI matches local production builds.

Use **`npm run netlify:…`** (or `npx netlify …`) so the Netlify CLI from `node_modules/.bin` is used. Typing `netlify` alone only works if you installed the CLI globally (`npm i -g netlify-cli`).

### Option A — Netlify CLI (terminal)

From the project root (after `npm install`):

```bash
npm run netlify:login
```

Opens the browser to authorize the CLI (one time per machine).

Then connect this repo to a new Netlify site and enable **continuous deploy** from GitHub:

```bash
npm run netlify:init
```

Follow the prompts: pick your team, **Create & configure a new project**, choose **GitHub**, select **`verb-master`** (or your fork), confirm the build settings match `netlify.toml`. Netlify will add the deploy hook; every `git push` to `main` triggers a new deploy.

**Step-by-step at the first question (“What would you like to do?”):**

1. Use **↓** to highlight **“Create & configure a new project”** (not “Connect to an existing…”) unless you already created the site on the Netlify website — then choose **Connect** and pick that site.
2. **Enter** — pick your Netlify team / account.
3. When asked for the **site name**, something like `verb-master` is fine (must be unique on Netlify).
4. **Build command:** `npm run build` (should match `netlify.toml`).
5. For **Next.js**, Netlify usually detects the framework; if it asks for a publish directory, accept the default the CLI suggests for Next.
6. **Authorize GitHub** in the browser if asked, then choose repo **`willianmbotacin/verb-master`** and branch **`main`**.

Check login: `npm run netlify:status`.

### Option B — Netlify website

1. [Netlify](https://app.netlify.com/) → **Add new site** → **Import an existing project**.
2. Connect **GitHub** and select this repository.
3. Confirm **Build command:** `npm run build` and Node **22** (from `netlify.toml`).
4. **Deploy site**.

### Manual production deploy from CLI (optional)

If the site is already linked (`netlify init` created `.netlify/state.json`, which is gitignored):

```bash
npm run netlify:deploy
```

For Next.js, Netlify runs your build on their side; this command uploads the result. Prefer **Git-based deploys** so every push deploys automatically.
