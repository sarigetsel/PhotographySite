import { motion } from 'framer-motion'
import { ArrowLeft, Images } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPicPath } from '../utils/images'
import { useInView } from '../hooks/useInView'

const PREVIEW = [3, 18, 27, 45, 58, 71, 89, 102, 115, 8, 33, 66, 22, 55, 77, 91]

function PhotoCard({ src, index }) {
  return (
    <div className="flex h-64 w-[220px] shrink-0 items-center justify-center md:h-80 md:w-[260px]">
      <img
        src={src}
        alt={`תצוגה ${index + 1}`}
        loading="lazy"
        decoding="async"
        className="max-h-full max-w-full rounded-md object-contain shadow-sm"
      />
    </div>
  )
}

function MarqueeRow({ photos, ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-5" aria-hidden={ariaHidden}>
      {photos.map((src, i) => (
        <PhotoCard key={`${src}-${i}`} src={src} index={i} />
      ))}
    </div>
  )
}

export default function GalleryTeaser() {
  const [ref, inView] = useInView()
  const photos = PREVIEW.map((n) => getPicPath(n))

  return (
    <section className="overflow-hidden bg-brand-antique-pink py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-brand-dark/50 uppercase">
            Portfolio
          </p>
          <h2 className="font-serif text-4xl font-light text-brand-dark md:text-5xl">
            הצצה לעבודות
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-dark/70">
            רגעים שנתפסו בטבע, באור טבעי ובאהבה — הגלריה המלאה מחכה לכם בדף נפרד
          </p>
        </motion.div>

        <div className="relative mb-14" dir="ltr">
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-antique-pink to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-antique-pink to-transparent md:w-24" />

          <div className="overflow-hidden py-2">
            <div className="marquee-track flex w-max items-center">
              <MarqueeRow photos={photos} />
              <MarqueeRow photos={photos} ariaHidden />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-3 rounded-full bg-brand-dark px-10 py-4 text-sm font-medium tracking-wide text-white shadow-xl transition-all duration-300 hover:bg-brand-coral hover:shadow-brand-coral/30"
          >
            <Images size={18} />
            לגלריה המלאה
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
