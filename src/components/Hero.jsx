import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { HERO_SLIDES, LOGO_PATH } from '../utils/images'

export default function Hero({ onNavigate }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative h-screen min-h-[600px] overflow-hidden">
      {HERO_SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full scale-105 object-cover will-change-transform"
            style={{ transform: i === current ? 'scale(1)' : 'scale(1.05)' }}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.img
          src={LOGO_PATH}
          alt="צילום רות"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 h-24 w-auto object-contain drop-shadow-2xl md:h-32 lg:h-40"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-2 text-sm font-light uppercase tracking-[0.35em] text-white/80 md:text-base"
        >
          Lifestyle · Family · Children
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mb-6 max-w-3xl font-serif text-4xl font-light leading-tight md:text-6xl lg:text-7xl"
        >
          רגעים אמיתיים, זכרונות לנצח
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-10 max-w-xl text-base font-light leading-relaxed text-white/85 md:text-lg"
        >
          צילום לייף-סטייל, משפחה וילדים — חם, טבעי ומלא אהבה
        </motion.p>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('contact')}
          className="rounded-full border border-white/60 bg-white/10 px-10 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-stone-900"
        >
          הזמינו סשן
        </motion.button>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => onNavigate('gallery')}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
        aria-label="גלול לגלריה"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </motion.button>

      <div className="absolute bottom-8 right-8 z-10 hidden gap-2 md:flex">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`שקף ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
