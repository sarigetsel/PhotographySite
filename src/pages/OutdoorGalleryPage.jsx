import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import OutdoorGallery from '../components/OutdoorGallery'

export default function OutdoorGalleryPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-4 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <p className="mb-2 text-sm tracking-[0.3em] text-brand-coral uppercase">
              צילומי חוצות
            </p>
            <h1 className="font-serif text-4xl font-light text-brand-dark md:text-5xl">
              הטבע והחופש
            </h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-brand-dark/70 transition-colors hover:text-brand-coral"
          >
            <ArrowRight size={16} />
            חזרה לדף הבית
          </Link>
        </motion.div>
      </div>
      <OutdoorGallery showHeader={false} />
    </div>
  )
}
