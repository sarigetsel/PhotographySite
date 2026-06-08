import { motion } from 'framer-motion'
import { Calendar, Camera, Heart } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const STEPS = [
  {
    icon: Heart,
    num: '01',
    title: 'שיחה וחיבור',
    text: 'נדבר על החלום שלכם — מה חוגגים, איפה מתאים לכם, ומה חשוב לתפוס. ביחד נבנה את הסשן המושלם.',
  },
  {
    icon: Camera,
    num: '02',
    title: 'יום הצילום',
    text: 'בלי לחץ, בלי פוזות — רק אתם, הטבע והרגע. אני מנחה בעדינות ונותנת לרגעים לקרות מעצמם.',
  },
  {
    icon: Calendar,
    num: '03',
    title: 'גלריה אישית',
    text: 'תוך שבועיים תקבלו גלריה מעוצבת עם התמונות היפות ביותר — מוכנות להדפסה, לשיתוף ולזיכרון.',
  },
]

export default function ProcessSection() {
  const [ref, inView] = useInView()

  return (
    <section className="bg-brand-light py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-brand-dark/50 uppercase">
            The Process
          </p>
          <h2 className="font-serif text-4xl font-light text-brand-dark md:text-5xl">
            איך זה עובד?
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-2xl border border-brand-sage bg-white p-8 shadow-sm"
            >
              <span className="absolute top-6 left-6 font-serif text-5xl text-brand-antique-pink">
                {step.num}
              </span>
              <div className="mb-5 mt-8 inline-flex rounded-full bg-brand-sage/60 p-3 text-brand-dark">
                <step.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 font-serif text-xl text-brand-dark">{step.title}</h3>
              <p className="text-sm leading-relaxed text-brand-dark/70">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
