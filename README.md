# Photography Site — Ruth

A premium single-page landing website for lifestyle, family, and children photography.

## Stack

- React + Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React

## Development

```bash
npm install
npm run dev
```

## Live Site

**https://sarigetsel.github.io/PhotographySite/**

The site deploys automatically to GitHub Pages on every push to `main`.

### GitHub Pages setup

1. Repo **Settings → Pages → Build and deployment**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` → folder `/ (root)` → Save
4. Optional: add `VITE_WEB3FORMS_ACCESS_KEY` under **Settings → Secrets → Actions** for the contact form

Every push to `main` rebuilds the site and updates the `gh-pages` branch automatically.

## Build

```bash
npm run build
npm run preview
```

## Assets

Place photos in the `pics/` folder at project root. A junction `public/pics` → `pics` is used for Vite static serving.

On Windows, recreate the junction if needed:

```cmd
mklink /J public\pics pics
```

## Contact Details

Update placeholder contact info in `src/components/Contact.jsx`.
