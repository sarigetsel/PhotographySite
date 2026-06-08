import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LOGO_PATH } from '../utils/images'

const LINKS = [
  { id: 'home', label: 'בית' },
  { id: 'gallery', label: 'גלריה' },
  { id: 'about', label: 'אודות' },
  { id: 'pricing', label: 'מחירון' },
  { id: 'contact', label: 'צור קשר' },
]

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-gradient-to-b from-black/40 to-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="relative z-10 shrink-0"
            aria-label="חזרה לדף הבית"
          >
            <img
              src={LOGO_PATH}
              alt="לוגו"
              className={`h-12 w-auto object-contain transition-all duration-500 md:h-14 ${
                scrolled ? '' : 'drop-shadow-lg brightness-110'
              }`}
            />
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNav(link.id)}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:opacity-70 ${
                    scrolled ? 'text-stone-800' : 'text-white'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative z-10 md:hidden ${scrolled ? 'text-stone-800' : 'text-white'}`}
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
            className="fixed inset-0 z-40 bg-stone-900/95 backdrop-blur-sm md:hidden"
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
                    onClick={() => handleNav(link.id)}
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
