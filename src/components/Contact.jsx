import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Phone, Share2 } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const CONTACT_LINKS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/972500000000',
    sub: '050-000-0000',
  },
  {
    icon: Share2,
    label: 'Instagram',
    href: 'https://instagram.com',
    sub: '@photography_ruth',
  },
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:hello@example.com',
    sub: 'hello@example.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    href: 'tel:+972500000000',
    sub: '050-000-0000',
  },
]

export default function Contact() {
  const [ref, inView] = useInView()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = encodeURIComponent(
      `שם: ${form.name}\nאימייל: ${form.email}\n\n${form.message}`,
    )
    window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent('פנייה מהאתר')}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-stone-400">
            Contact
          </p>
          <h2 className="font-serif text-4xl font-light text-stone-800 md:text-5xl">
            בואו נדבר
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-500">
            מחכה לשמוע מכם — שלחו הודעה ונחזור אליכם בהקדם
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {CONTACT_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex flex-col items-center rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center transition-all duration-300 hover:border-stone-300 hover:bg-stone-100 hover:shadow-md"
              >
                <div className="mb-3 rounded-full bg-white p-3 text-stone-600 shadow-sm transition-colors group-hover:bg-stone-800 group-hover:text-white">
                  <item.icon size={22} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-stone-800">{item.label}</span>
                <span className="mt-1 text-xs text-stone-400">{item.sub}</span>
              </a>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-stone-600">
                שם מלא
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none transition-colors focus:border-stone-400 focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-stone-600">
                אימייל
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none transition-colors focus:border-stone-400 focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm text-stone-600">
                הודעה
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none transition-colors focus:border-stone-400 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-stone-800 py-3.5 text-sm font-medium text-white transition-colors hover:bg-stone-700"
            >
              {sent ? 'נפתחת תיבת דואר' : 'שליחה'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
