import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Mail, MessageCircle, Phone, Share2 } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { BRAND, WEB3FORMS_ACCESS_KEY } from '../utils/config'

const CONTACT_LINKS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: `https://wa.me/${BRAND.whatsapp}`,
    sub: BRAND.phone,
  },
  {
    icon: Share2,
    label: 'Instagram',
    href: BRAND.instagram,
    sub: BRAND.instagramHandle,
  },
  {
    icon: Mail,
    label: 'Email',
    href: `mailto:${BRAND.email}`,
    sub: BRAND.email,
  },
  {
    icon: Phone,
    label: 'טלפון',
    href: `tel:+${BRAND.whatsapp}`,
    sub: BRAND.phone,
  },
]

export default function Contact() {
  const [ref, inView] = useInView()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('sent') === '1') {
      setStatus('success')
      window.history.replaceState({}, '', `${window.location.pathname}#contact`)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!WEB3FORMS_ACCESS_KEY) {
      const subject = encodeURIComponent('פנייה מהאתר — Rut Getsel Photography')
      const body = encodeURIComponent(
        `שם: ${form.name}\nאימייל: ${form.email}\nטלפון: ${form.phone}\n\n${form.message}`,
      )
      window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'פנייה חדשה מהאתר — Rut Getsel Photography',
          from_name: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="bg-brand-sage/30 py-24 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-[0.3em] text-brand-coral uppercase">
            Contact
          </p>
          <h2 className="font-serif text-4xl font-light text-brand-dark md:text-5xl">
            בואו נדבר
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-dark/70">
            מחכה לשמוע מכם — שלחו הודעה ואחזור אליכם בהקדם
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
                className="group flex flex-col items-center rounded-2xl border border-brand-sage bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-coral/40 hover:shadow-lg"
              >
                <div className="mb-3 rounded-full bg-brand-antique-pink/70 p-3 text-brand-dark transition-colors group-hover:bg-brand-coral group-hover:text-white">
                  <item.icon size={22} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-brand-dark">{item.label}</span>
                <span className="mt-1 text-xs break-all text-brand-dark/50">{item.sub}</span>
              </a>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-5 rounded-2xl border border-brand-sage bg-white p-8 shadow-sm"
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-brand-dark/70">
                שם מלא
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-brand-sage bg-brand-light/50 px-4 py-3 text-brand-dark outline-none transition-colors focus:border-brand-coral focus:bg-white"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm text-brand-dark/70">
                  אימייל
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-brand-sage bg-brand-light/50 px-4 py-3 text-brand-dark outline-none transition-colors focus:border-brand-coral focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm text-brand-dark/70">
                  טלפון
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-brand-sage bg-brand-light/50 px-4 py-3 text-brand-dark outline-none transition-colors focus:border-brand-coral focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm text-brand-dark/70">
                הודעה
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="ספרו לי על הסשן שחלמתם עליו..."
                className="w-full resize-none rounded-xl border border-brand-sage bg-brand-light/50 px-4 py-3 text-brand-dark outline-none transition-colors focus:border-brand-coral focus:bg-white"
              />
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2 rounded-xl bg-brand-sage/50 px-4 py-3 text-sm text-brand-dark">
                <CheckCircle size={18} className="text-brand-coral" />
                ההודעה נשלחה בהצלחה ל-{BRAND.email}! אחזור אליכם בהקדם.
              </div>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-600">
                משהו השתבש. נסו שוב או שלחו מייל ישירות ל-{BRAND.email}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-dark py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-coral disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  שולח...
                </>
              ) : (
                'שליחה'
              )}
            </button>

            <p className="text-center text-xs text-brand-dark/45">
              ההודעה נשלחת ישירות ל-{BRAND.email}
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
