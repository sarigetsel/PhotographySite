import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Images } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '../utils/images'

export default function Hero({ onNavigate }) {
  const [current, setCurrent] = useState(0)
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 500], [0, 120])
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative h-screen min-h-[700px] overflow-hidden">
      {HERO_SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className={`h-full w-full object-cover will-change-transform ${
              i === current ? 'animate-ken-burns' : 'scale-110'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/50 via-brand-dark/30 to-brand-navy/70" />

      <div className="pointer-events-none absolute top-1/4 -right-16 h-48 w-48 animate-float rounded-full bg-brand-coral/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/3 -left-10 h-40 w-40 animate-pulse-soft rounded-full bg-brand-sage/30 blur-2xl" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-16 text-center text-white md:pt-20"
      >
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 h-px w-16 bg-brand-antique-pink/80"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-4 text-xs font-light tracking-[0.45em] text-brand-antique-pink/90 uppercase md:text-sm"
        >
          Lifestyle · Family · Children
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mb-5 max-w-4xl font-serif text-4xl leading-tight font-light md:text-6xl lg:text-7xl"
        >
          רגעים אמיתיים,
          <br />
          <span className="text-brand-antique-pink">זכרונות לנצח</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mb-10 max-w-xl text-base leading-relaxed font-light text-white/90 md:text-lg"
        >
          צילום משפחות וילדים בטבע — חם, טבעי ומלא אהבה
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('contact')}
            className="rounded-full bg-brand-coral px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg shadow-brand-coral/30 transition-colors hover:bg-brand-coral/90"
          >
            הזמינו סשן
          </motion.button>

          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-8 py-3.5 text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-all hover:bg-white hover:text-brand-dark"
          >
            <Images size={16} />
            לגלריה
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`שקף ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? 'w-10 bg-brand-coral' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
