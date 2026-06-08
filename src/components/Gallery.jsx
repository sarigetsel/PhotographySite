import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getAllPicPaths } from '../utils/images'
import { useInView } from '../hooks/useInView'
import Lightbox from './Lightbox'

function GalleryItem({ src, index, onClick }) {
  const [ref, inView] = useInView()
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 10) * 0.04 }}
      className="mb-4 break-inside-avoid"
    >
      <button
        type="button"
        onClick={() => onClick(index)}
        className="group relative block w-full overflow-hidden rounded-xl bg-brand-sage/40 shadow-sm"
      >
        {inView && (
          <img
            src={src}
            alt={`גלריה ${index + 1}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-brand-dark/0 transition-colors duration-500 group-hover:bg-brand-dark/15" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-brand-navy/60 to-transparent p-3 transition-transform duration-500 group-hover:translate-y-0">
          <span className="text-xs tracking-widest text-white uppercase">צפייה</span>
        </div>
      </button>
    </motion.div>
  )
}

export default function Gallery({ showHeader = true }) {
  const images = getAllPicPaths()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [headerRef, headerInView] = useInView()
  const touchStart = useRef(null)

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const navigateLightbox = useCallback(
    (dir) => {
      setLightboxIndex((prev) => {
        if (prev === null) return null
        return (prev + dir + images.length) % images.length
      })
    },
    [images.length],
  )

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? 1 : -1)
    touchStart.current = null
  }

  return (
    <section id="gallery" className="bg-brand-light py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {showHeader && (
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-sm font-medium tracking-[0.3em] text-brand-coral uppercase">
              Portfolio
            </p>
            <h2 className="font-serif text-4xl font-light text-brand-dark md:text-5xl">
              הגלריה
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-brand-dark/65">
              רגעים שנתפסו באהבה — לחצו על תמונה להגדלה
            </p>
          </motion.div>
        )}

        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 lg:gap-5">
          {images.map((src, i) => (
            <GalleryItem key={src} src={src} index={i} onClick={openLightbox} />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
          />
        </div>
      )}
    </section>
  )
}
