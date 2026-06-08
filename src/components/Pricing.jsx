import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Maximize2, X } from 'lucide-react'
import { PRICE_PATHS } from '../utils/images'
import { useInView } from '../hooks/useInView'

function PriceImage({ className }) {
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={PRICE_PATHS[srcIndex]}
      alt="מחירון צילום"
      loading="eager"
      fetchPriority="high"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(false)
        if (srcIndex < PRICE_PATHS.length - 1) setSrcIndex(srcIndex + 1)
      }}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
    />
  )
}

export default function Pricing({ onNavigate }) {
  const [ref, inView] = useInView()
  const [modalOpen, setModalOpen] = useState(false)

  const downloadPrice = () => {
    const link = document.createElement('a')
    link.href = PRICE_PATHS[0]
    link.download = 'rut-getsel-price-list'
    link.click()
  }

  return (
    <section id="pricing" className="bg-brand-sage/50 py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-5xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-brand-coral uppercase">
            Packages
          </p>
          <h2 className="font-serif text-4xl font-light text-brand-dark md:text-5xl">
            מחירון 2026
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-dark/70">
            חבילות גמישות — מיני, מאסטר ופרימיום. לכל סוג של סשן, בטבע ובאור טבעי
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="group relative mx-auto max-w-2xl"
        >
          <div className="overflow-hidden rounded-2xl border-2 border-brand-dark/10 bg-white p-3 shadow-2xl shadow-brand-dark/10 transition-shadow duration-500 group-hover:shadow-brand-coral/20">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="relative block min-h-[420px] w-full overflow-hidden rounded-xl bg-brand-light/50 md:min-h-[520px]"
            >
              <PriceImage className="w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/0 opacity-0 transition-all duration-500 group-hover:bg-brand-dark/25 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-brand-dark backdrop-blur-sm">
                  <Maximize2 size={16} />
                  הגדלה
                </span>
              </div>
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={downloadPrice}
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-dark bg-white px-8 py-3 text-sm font-medium text-brand-dark transition-all hover:bg-brand-dark hover:text-white"
            >
              <Download size={16} />
              הורדת מחירון
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-8 py-3 text-sm font-medium text-white shadow-lg shadow-brand-coral/25 transition-all hover:bg-brand-coral/90"
            >
              שאלו אותי
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/95 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white md:top-8 md:right-8"
              aria-label="סגור"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-h-[90vh] max-w-4xl overflow-auto rounded-xl bg-white p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <PriceImage className="w-full object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
