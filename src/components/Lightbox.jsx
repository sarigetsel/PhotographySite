import { useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function Lightbox({ images, index, onClose, onNavigate }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(1)
      if (e.key === 'ArrowLeft') onNavigate(-1)
    },
    [onClose, onNavigate],
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [handleKey])

  const current = images[index]

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:text-white md:right-8 md:top-8"
            aria-label="סגור"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(-1)
            }}
            className="absolute left-2 z-10 rounded-full p-3 text-white/70 transition-colors hover:text-white md:left-6"
            aria-label="תמונה קודמת"
          >
            <ChevronLeft size={36} />
          </button>

          <motion.img
            key={current}
            src={current}
            alt={`תמונה ${index + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(1)
            }}
            className="absolute right-2 z-10 rounded-full p-3 text-white/70 transition-colors hover:text-white md:right-6"
            aria-label="תמונה הבאה"
          >
            <ChevronRight size={36} />
          </button>

          <p className="absolute bottom-6 text-sm tracking-widest text-white/50">
            {index + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
