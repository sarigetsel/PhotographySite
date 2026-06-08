# Rut Getsel Photography Site — Agent Guide

Hebrew RTL photography portfolio (React + Vite + Tailwind v4), deployed to GitHub Pages.

## Stack

- React 19, Vite 8, React Router, Framer Motion, Tailwind CSS v4
- Live: https://sarigetsel.github.io/PhotographySite/
- Repo: `sarigetsel/PhotographySite` on `main`; deploy pushes `dist` to `gh-pages`

## Project layout

- `pics/` — source images (124 photos, logo, price list). Copied to `public/pics` at build via `scripts/ensure-pics-link.js`
- `src/utils/images.js` — image paths; always URL-encode segments (`pic (1).jpg`)
- `src/utils/config.js` — brand contact info
- `src/components/Contact.jsx` — Web3Forms (access key embedded in component)
- Base path in production: `/PhotographySite/` (`VITE_BASE_PATH` in CI)

## Brand colors (index.css @theme)

- `--color-brand-price-bg: #f2f0ed` — section backgrounds matching price list (QuoteSection, GalleryTeaser)
- `--color-brand-antique-pink` — accents/icons only
- Sage, coral, dark, navy — see `src/index.css`

## Conventions

- UI copy in Hebrew, RTL (`dir="rtl"` on html)
- Do not commit `.env` or `public/pics/` (local copy)
- Marquee/gallery images: use `loading="eager"` (lazy breaks inside CSS transform animations)
- After pushing to `main`, GitHub Actions deploys automatically (~2 min)

## Common tasks

- **Deploy**: push to `main` — no manual gh-pages steps
- **Contact form**: Web3Forms key in `Contact.jsx`; allow `sarigetsel.github.io` in web3forms.com dashboard
- **New images**: add to `pics/`, keep naming `pic (N).jpg`
