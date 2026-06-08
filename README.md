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
