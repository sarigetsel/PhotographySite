import { motion } from 'framer-motion'
import { Heart, Leaf, Sparkles, Sun, TreePine } from 'lucide-react'
import { getPicPath } from '../utils/images'
import { useInView } from '../hooks/useInView'

const FEATURES = [
  {
    icon: Heart,
    title: 'חום משפחתי',
    text: 'כל משפחה מספרת סיפור ייחודי משלה. אני מתעדת את הקשר, הצחוק, החיבוק והמבטים — בלי פוזות מלאכותיות ובלי לחץ. המטרה שלי היא שתרגישו בנוח, ושהילדים ייהנו מהחוויה.',
  },
  {
    icon: Sparkles,
    title: 'שמחת ילדים',
    text: 'ילדים הם הכי יפים כשהם טבעיים. אני יוצרת סביבה משחקית, קלה ומהנה — עם הפסקות, צחוק וחופש לזוז. כך נולדות התמונות הכי אמיתיות ומרגשות.',
  },
  {
    icon: Sun,
    title: 'לייף-סטייל אותנטי',
    text: 'צילום בטבע, בבית, בחוף או בכל מקום שמספר את הסיפור שלכם. אור טבעי, רגעים בלתי-מתוזמנים ותחושה של חיים אמיתיים — לא סטודיו, לא מתוח.',
  },
  {
    icon: TreePine,
    title: 'צילום בטבע',
    text: 'הטבע הוא הסטודיו שלי. עצים, דשא, שמיים ואור זהב — הרקע המושלם לתמונות משפחתיות וילדים שמרגישות חמות, אורגניות ומלאות חיים.',
  },
  {
    icon: Leaf,
    title: 'גישה אישית',
    text: 'כל לקוח מקבל יחס אישי ותשומת לב. מהשיחה הראשונה ועד מסירת התמונות — אני שם בשבילכם, עם סבלנות, הקשבה ואהבה לעבודה.',
  },
]

export default function About() {
  const [ref, inView] = useInView()
  const [imgRef, imgInView] = useInView()

  return (
    <section id="about" className="bg-brand-light py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-brand-coral uppercase">
            About
          </p>
          <h2 className="font-serif text-4xl font-light text-brand-dark md:text-5xl">
            שלום, אני רות
          </h2>
        </motion.div>

        <div className="mb-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: 30 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-brand-dark/10">
              <img
                src={getPicPath(16)}
                alt="צילום משפחתי"
                loading="lazy"
                className="w-full object-contain"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-brand-antique-pink" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="space-y-5 text-brand-dark/80"
          >
            <p className="text-lg leading-relaxed md:text-xl">
              אני צלמת לייף-סטייל, משפחות וילדים, ומאמינה שצילום טוב נולד מתוך קשר
              אמיתי — לא מתוך הוראות. כל סשן הוא חוויה קלה, נעימה ומלאת צחוק, שבסופה
              נולדות תמונות מלאות רגש, חום ואותנטיות.
            </p>
            <p className="leading-relaxed">
              הגעתי לעולם הצילום מתוך אהבה עמוקה לרגעים הקטנים — הבטן, המבט, החיוך
              שעובר בין הורים לילדים. אני לא מנסה לייצר רגעים; אני פשוט שם, עוקבת
              ושומרת עליהם לפני שהם נעלמים. זו בדיוק הפילוסופיה שלי, וזו הסיבה שכל
              לקוח חוזר אליי שוב ושוב.
            </p>
            <p className="leading-relaxed">
              אני מתמחה בצילום בטבע — בין עצים, על דשא, ליד הים — כי שם האור הכי
              יפה והאווירה הכי טבעית. בין אם מדובר ביום הולדת, הריון, משפחה גדולה,
              צילומי ניו בורן או סתם יום יפה בחוף — אני שם כדי לתת לכם זיכרון שישאר
              לנצח.
            </p>
            <p className="font-serif text-xl text-brand-coral italic">
              "אני לא יוצרת רגעים — רק שומרת עליהם לפני שהם נעלמים"
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
              className="group rounded-2xl border border-brand-sage/80 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-dark/5"
            >
              <div className="mb-4 inline-flex rounded-full bg-brand-antique-pink/70 p-3 text-brand-dark transition-colors group-hover:bg-brand-coral group-hover:text-white">
                <item.icon size={20} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-serif text-xl text-brand-dark">{item.title}</h3>
              <p className="text-sm leading-relaxed text-brand-dark/65">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
