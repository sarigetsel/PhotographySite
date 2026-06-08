import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Maximize2, X } from 'lucide-react'
import { PRICE_PATHS } from '../utils/images'
import { useInView } from '../hooks/useInView'

function PriceImage({ className }) {
  const [srcIndex, setSrcIndex] = useState(0)

  return (
    <img
      src={PRICE_PATHS[srcIndex]}
      alt="מחירון צילום"
      className={className}
      onError={() => {
        if (srcIndex < PRICE_PATHS.length - 1) setSrcIndex(srcIndex + 1)
      }}
    />
  )
}

export default function Pricing({ onNavigate }) {
  const [ref, inView] = useInView()
  const [modalOpen, setModalOpen] = useState(false)

  const downloadPrice = () => {
    const link = document.createElement('a')
    link.href = PRICE_PATHS[0]
    link.download = 'price-list'
    link.click()
  }

  return (
    <section id="pricing" className="bg-stone-100 py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-5xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-stone-400">
            Packages
          </p>
          <h2 className="font-serif text-4xl font-light text-stone-800 md:text-5xl">
            מחירון וחבילות
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-500">
            חבילות גמישות לכל סוג של סשן — מיום הולדת ועד צילומי הריון ומשפחה
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="group relative mx-auto max-w-2xl"
        >
          <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-3 shadow-xl shadow-stone-300/30 transition-shadow duration-500 group-hover:shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="relative block w-full overflow-hidden rounded-xl"
            >
              <PriceImage className="w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-500 group-hover:bg-black/20 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-stone-800 backdrop-blur-sm">
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
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-8 py-3 text-sm font-medium text-stone-700 transition-all hover:border-stone-800 hover:bg-stone-800 hover:text-white"
            >
              <Download size={16} />
              הורדת מחירון
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 rounded-full bg-stone-800 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-stone-700"
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-white/70 hover:text-white md:right-8 md:top-8"
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
