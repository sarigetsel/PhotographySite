import { motion } from 'framer-motion'
import { Heart, Sparkles, Sun } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const FEATURES = [
  {
    icon: Heart,
    title: 'חום משפחתי',
    text: 'כל משפחה מספרת סיפור ייחודי. אני מתעדת את הקשר, הצחוק והחיבוק — בלי פוזות מלאכותיות.',
  },
  {
    icon: Sparkles,
    title: 'שמחת ילדים',
    text: 'ילדים הם טבעיים כשמרגישים בנוח. אני יוצרת סביבה משחקית שמאפשרת להם להיות עצמם.',
  },
  {
    icon: Sun,
    title: 'לייף-סטייל אותנטי',
    text: 'צילום בטבע, בבית או בחוף — רגעים אמיתיים של חיים, אור רך ותחושה בלתי-מתוזמנת.',
  },
]

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="bg-stone-50 py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-stone-400">
            הקונסепט
          </p>
          <h2 className="font-serif text-4xl font-light text-stone-800 md:text-5xl">
            לתפוס את הרגע, לא רק את התמונה
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <p className="text-lg leading-relaxed text-stone-600 md:text-xl">
            אני מאמינה שצילום טוב נולד מתוך קשר — לא מתוך הוראות. כל סשן הוא חוויה
            קלה ונעימה, שבסופה נולדות תמונות מלאות רגש, חום ואותנטיות. בין אם
            מדובר ביום הולדת, הריון, משפחה גדולה או סתם יום יפה בחוף — אני שם
            כדי לשמור על הזיכרון הזה לנצח.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
              className="group rounded-2xl bg-white p-8 shadow-sm transition-shadow duration-500 hover:shadow-md"
            >
              <div className="mb-5 inline-flex rounded-full bg-stone-100 p-3 text-stone-600 transition-colors group-hover:bg-stone-800 group-hover:text-white">
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 font-serif text-xl text-stone-800">{item.title}</h3>
              <p className="text-sm leading-relaxed text-stone-500">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
