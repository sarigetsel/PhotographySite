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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 12) * 0.03 }}
      className="mb-4 break-inside-avoid"
    >
      <button
        type="button"
        onClick={() => onClick(index)}
        className="group relative block w-full overflow-hidden rounded-lg bg-stone-200"
      >
        {inView && (
          <img
            src={src}
            alt={`גלריה ${index + 1}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`w-full object-cover transition-all duration-700 group-hover:scale-[1.03] ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      </button>
    </motion.div>
  )
}

export default function Gallery() {
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
    <section id="gallery" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-stone-400">
            Portfolio
          </p>
          <h2 className="font-serif text-4xl font-light text-stone-800 md:text-5xl">
            הגלריה
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-500">
            {images.length} רגעים שנתפסו באהבה — לחצו על תמונה להגדלה
          </p>
        </motion.div>

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
