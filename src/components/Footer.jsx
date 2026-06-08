import { LOGO_PATH } from '../utils/images'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 lg:px-10">
        <img
          src={LOGO_PATH}
          alt="צילום רות"
          className="h-16 w-auto object-contain opacity-80"
        />
        <p className="text-sm text-stone-400">
          © {year} צילום רות — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  )
}
