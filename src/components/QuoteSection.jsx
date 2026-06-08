import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { QUOTE } from '../utils/config'

export default function QuoteSection() {
  const [ref, inView] = useInView()

  return (
    <section className="bg-brand-price-bg py-20 md:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl px-6 text-center lg:px-10"
      >
        <span className="mb-6 inline-block text-5xl text-brand-coral/60">"</span>
        <blockquote className="font-serif text-3xl leading-relaxed font-light text-brand-dark md:text-4xl lg:text-5xl">
          {QUOTE}
        </blockquote>
        <div className="mx-auto mt-8 h-px w-24 bg-brand-coral/50" />
        <p className="mt-6 text-sm tracking-[0.25em] text-brand-dark/60 uppercase">
          Rut Getsel Photography
        </p>
      </motion.div>
    </section>
  )
}
