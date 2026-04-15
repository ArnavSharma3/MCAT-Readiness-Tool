# Calm MCAT Readiness

A gentle, pastel-focused MCAT preparation web app built with Next.js, Tailwind CSS, and localStorage (no backend, no database, no API calls).

## Features

- **Readiness Score Dashboard**: section score inputs, optional FL scores, blended projection, and a calm readiness arc.
- **Daily Task Tracker**: preloaded Apr 15 to May 9 plan, today-first view, editable/reorderable tasks, silent forward redistribution.
- **Daily Session Timer**: built-in burndown timer sequence with gentle visual transitions and optional soft chime.
- **Delay Decision Tool**: subtle footer access to a supportive checklist with calm recommendation language.

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- localStorage for persistence

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run lint
npm run build
```

## Deploy to Vercel

### Option 1: Vercel dashboard (recommended)

1. Push this repo to GitHub.
2. Go to [Vercel](https://vercel.com/new).
3. Import the GitHub repository.
4. Keep defaults (framework auto-detected as Next.js) and deploy.

### Option 2: CLI

```bash
npx vercel
npx vercel --prod
```

No environment variables are required for this app.
