import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LOGO_PATH } from '../utils/images'

const LINKS = [
  { id: 'home', label: 'בית', path: '/' },
  { id: 'gallery', label: 'גלריה', path: '/gallery' },
  { id: 'about', label: 'אודות', path: '/#about' },
  { id: 'pricing', label: 'מחירון', path: '/#pricing' },
  { id: 'contact', label: 'צור קשר', path: '/#contact' },
]

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const lightNav = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const handleNav = (link) => {
    setMenuOpen(false)
    if (link.path.startsWith('/#')) {
      const section = link.path.slice(2)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => onNavigate(section), 100)
      } else {
        onNavigate(section)
      }
    } else {
      navigate(link.path)
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          lightNav
            ? 'bg-gradient-to-b from-brand-navy/50 to-transparent'
            : 'bg-brand-light/95 shadow-sm backdrop-blur-md'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="relative z-10 shrink-0" aria-label="חזרה לדף הבית">
            <img
              src={LOGO_PATH}
              alt="Rut Getsel Photography"
              className={`h-12 w-auto object-contain transition-all duration-500 md:h-14 ${
                lightNav ? 'drop-shadow-lg brightness-110' : ''
              }`}
            />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNav(link)}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-brand-coral ${
                    lightNav ? 'text-white' : 'text-brand-dark'
                  } ${location.pathname === link.path ? 'text-brand-coral' : ''}`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative z-10 md:hidden ${lightNav ? 'text-white' : 'text-brand-dark'}`}
            aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-navy/97 backdrop-blur-sm md:hidden"
          >
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex h-full flex-col items-center justify-center gap-8"
            >
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <button
                    type="button"
                    onClick={() => handleNav(link)}
                    className="text-2xl font-light tracking-widest text-white"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
