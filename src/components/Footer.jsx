import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { LOGO_PATH } from '../utils/images'
import { BRAND } from '../utils/config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 lg:px-10">
        <Link to="/">
          <img
            src={LOGO_PATH}
            alt="Rut Getsel Photography"
            className="h-20 w-auto object-contain brightness-110"
          />
        </Link>

        <p className="text-center text-sm text-white/60">
          צילום משפחות וילדים בטבע · Lifestyle · Family · Children
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
          <a
            href={`tel:+${BRAND.whatsapp}`}
            className="flex items-center gap-2 transition-colors hover:text-brand-coral"
          >
            <Phone size={16} />
            {BRAND.phone}
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className="flex items-center gap-2 transition-colors hover:text-brand-coral"
          >
            <Mail size={16} />
            {BRAND.email}
          </a>
        </div>

        <div className="h-px w-24 bg-brand-coral/40" />

        <p className="text-xs text-white/40">
          © {year} Rut Getsel Photography — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  )
}
