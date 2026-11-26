// מקליט סרטון הדגמה של האתר במעבר אחד קדימה: פתיחה, אודות, קרוסלה, צילומי חוץ,
// גלריה מלאה, מחירון וטופס יצירת קשר (בלי שליחה).
// כדי שהגלילה תהיה חלקה, מריצים שרת dev עם עותקים מוקטנים של אותן תמונות:
//   DEMO_PUBLIC_DIR=<תיקייה עם pics מוקטנות> npx vite --config vite.demo.config.js --port 5176
//   DEMO_URL=http://127.0.0.1:5176 node scripts/capture-demo.mjs
//   node scripts/render-demo.mjs demo.mp4   (עריכה + מוזיקה)
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.DEMO_URL || 'http://127.0.0.1:5174'
const OUT_DIR = 'demo-raw'
const W = 1280
const H = 720

fs.rmSync(OUT_DIR, { recursive: true, force: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  acceptDownloads: true,
  recordVideo: { dir: OUT_DIR, size: { width: W, height: H } },
})
const page = await context.newPage()

const t0 = Date.now()

// --- טעינה מוקדמת של כל התמונות (החלק הזה נחתך מהסרטון) ---
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
const preload = () => page.evaluate(async () => {
  const base = '/'
  const enc = (p) => base + p.split('/').map(encodeURIComponent).join('/')
  const urls = [
    ...Array.from({ length: 174 }, (_, i) => enc(`pics/pic (${i + 1}).jpg`)),
    ...Array.from({ length: 155 }, (_, i) => enc(`pics/out/out (${i + 1}).jpg`)),
    enc('pics/price.jpg'),
    enc('pics/logo.png'),
  ]
  let i = 0
  const worker = async () => {
    while (i < urls.length) {
      const img = new Image()
      img.src = urls[i++]
      try { await img.decode() } catch { /* ignore */ }
    }
  }
  await Promise.all(Array.from({ length: 16 }, worker))
})
for (let attempt = 0; !process.env.SKIP_PRELOAD && attempt < 4; attempt++) {
  try {
    await preload()
    break
  } catch (e) {
    console.log('preload retry:', e.message.slice(0, 80))
    await page.waitForLoadState('domcontentloaded').catch(() => {})
    await page.waitForTimeout(1500)
  }
}
// טוענים נתיב ריק, נותנים לדפדפן להירגע, ואז ניווט פנימי לדף הבית —
// כך אנימציית הכניסה והחלפות השקופיות נקלטות בדיוק כמו באתר
await page.goto(`${BASE}/__start`, { waitUntil: 'networkidle' })
await page.mouse.move(W - 120, H - 80)
await page.waitForTimeout(2500)
await page.evaluate(() => {
  history.pushState({}, '', '/')
  dispatchEvent(new PopStateEvent('popstate'))
})
await page.waitForTimeout(60)
const trimStart = (Date.now() - t0) / 1000
console.log(`preload done, trim at ${trimStart.toFixed(2)}s`)

// --- עזרים שנראים כמו משתמש אמיתי ---
let mx = W - 120
let my = H - 80
const wait = (ms) => page.waitForTimeout(ms)
const log = (m) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] ${m}`)

// קטעים שיואצו בעריכה (גלילה מהירה על הגלריות)
const segments = []
async function fast(speed, fn) {
  const start = (Date.now() - t0) / 1000
  await fn()
  segments.push({ start, end: (Date.now() - t0) / 1000, speed })
}

async function moveTo(x, y, ms = 700) {
  const sx = mx
  const sy = my
  // עקומה קלה כמו יד אמיתית
  const cx = (sx + x) / 2 + (Math.random() - 0.5) * 120
  const cy = (sy + y) / 2 + (Math.random() - 0.5) * 80
  const start = Date.now()
  for (;;) {
    const t = Math.min(1, (Date.now() - start) / ms)
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    const px = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * x
    const py = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy + e * e * y
    await page.mouse.move(px, py)
    if (t >= 1) break
    await wait(12)
  }
  mx = x
  my = y
}

// גלילה חלקה בתוך הדף (requestAnimationFrame) — בלי קפיצות
async function scrollToY(target, pxPerSec = 1400, minMs = 500) {
  await page.evaluate(
    ({ target, pxPerSec, minMs }) =>
      new Promise((resolve) => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const to = Math.max(0, Math.min(max, target))
        const from = window.scrollY
        const dist = to - from
        const dur = Math.max(minMs, (Math.abs(dist) / pxPerSec) * 1000)
        const t0 = performance.now()
        let done = false
        const finish = () => {
          if (done) return
          done = true
          resolve()
        }
        const step = (now) => {
          if (done) return
          const t = Math.min(1, (now - t0) / dur)
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
          window.scrollTo({ top: from + dist * e, behavior: 'instant' })
          if (t < 1) requestAnimationFrame(step)
          else finish()
        }
        requestAnimationFrame(step)
        // ביטחון: אם requestAnimationFrame נתקע, לא לחכות לנצח
        setTimeout(() => {
          if (done) return
          window.scrollTo({ top: to, behavior: 'instant' })
          finish()
        }, dur + 3000)
      }),
    { target, pxPerSec, minMs },
  )
}

const scrollY = () => page.evaluate(() => window.scrollY)

async function scrollBy(dy, pxPerSec) {
  await scrollToY((await scrollY()) + dy, pxPerSec)
}

// גלילה עד הסוף, גם אם הדף מתארך בזמן הגלילה
async function scrollToBottom(pxPerSec) {
  for (let i = 0; i < 6; i++) {
    const { y, max } = await page.evaluate(() => ({
      y: window.scrollY,
      max: document.documentElement.scrollHeight - window.innerHeight,
    }))
    if (max - y < 4) break
    await scrollToY(max, pxPerSec)
  }
}

async function scrollToSel(selector, offset = 90, pxPerSec = 1400) {
  const top = await page.evaluate(
    ({ selector, offset }) =>
      document.querySelector(selector).getBoundingClientRect().top + window.scrollY - offset,
    { selector, offset },
  )
  await scrollToY(top, pxPerSec)
  await wait(250)
}

async function center(locator) {
  const box = await locator.boundingBox()
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

// אם האלמנט מחוץ למסך — גוללים אליו בעדינות קודם
async function ensureVisible(locator) {
  const box = await locator.boundingBox()
  if (box.y < 100 || box.y + box.height > H - 30) {
    await scrollBy(box.y + box.height / 2 - H / 2 - 40, 1200)
    await wait(250)
  }
}

async function clickOn(locator, ms = 700) {
  await ensureVisible(locator)
  let { x, y } = await center(locator)
  await moveTo(x, y, ms)
  await wait(150)
  ;({ x, y } = await center(locator))
  if (Math.hypot(x - mx, y - my) > 4) {
    await moveTo(x, y, 250)
    await wait(100)
  }
  if (process.env.DEBUG) console.log('click', Math.round(x), Math.round(y), await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.outerHTML.slice(0, 90), [x, y]))
  await page.mouse.down()
  await wait(90)
  await page.mouse.up()
}

async function hoverOn(locator, ms = 600, hold = 500) {
  await ensureVisible(locator)
  const { x, y } = await center(locator)
  await moveTo(x, y, ms)
  await wait(hold)
}

async function imagesReady(n = 8) {
  await page.waitForFunction(
    (n) => {
      const imgs = [...document.querySelectorAll('main section .columns-2 img')].slice(0, n)
      const first = document.querySelector('main section .columns-2 button')
      return (
        imgs.length >= Math.min(n, 4) &&
        imgs.every((i) => i.complete && i.naturalWidth > 0) &&
        first.getBoundingClientRect().height > 120
      )
    },
    n,
    { timeout: 120000 },
  )
  await wait(700)
}

async function waitScrollTop() {
  try {
    await page.waitForFunction(() => window.scrollY < 2, null, { timeout: 3500 })
  } catch {
    await scrollToY(0, 5000)
  }
  await wait(300)
}

async function typeHuman(text) {
  for (const ch of text) {
    await page.keyboard.type(ch)
    await wait(30 + Math.random() * 35)
  }
}

try {
const next = page.locator('button[aria-label="תמונה הבאה"]')
const navBtn = (name) => page.locator('header').getByRole('button', { name, exact: true })

log('דף הבית — פתיחה, השקופיות מתחלפות לבד')
await wait(1800)
await hoverOn(page.getByRole('button', { name: 'הזמינו סשן' }), 1200, 1600)
await hoverOn(page.locator('#home a[href$="/gallery"]'), 700, 2600)
await moveTo(W / 2 + 180, H / 2 + 60, 700)

log('גלילה: ציטוט, אודות, תהליך')
await scrollToSel('#about', 80, 1100)
await wait(1300)
await scrollBy(H * 1.5, 1100)
await wait(1100)

log('קרוסלת התמונות')
await scrollToSel('.marquee-track', 220, 1100)
await moveTo(W / 2 - 160, H / 2 - 70, 700)
await wait(2200)
await hoverOn(page.getByRole('link', { name: 'לגלריה המלאה' }), 600, 600)

log('צילומי חוץ')
await clickOn(page.getByRole('link', { name: /טבע וחופש/ }), 500)
await page.waitForURL('**/outdoor', { waitUntil: 'commit' })
await fast(3, async () => {
  await wait(400)
  await imagesReady()
})
await clickOn(page.locator('main section button').first(), 700)
await wait(1100)
await clickOn(next, 600)
await wait(800)
await page.keyboard.press('ArrowRight')
await wait(900)
await page.keyboard.press('Escape')
await wait(500)
await moveTo(W / 2 - 200, H / 2, 400)
await fast(5, () => scrollToBottom(700))
await wait(300)

log('הגלריה המלאה דרך התפריט')
await clickOn(navBtn('גלריה'), 700)
await page.waitForURL('**/gallery', { waitUntil: 'commit' })
await fast(3, async () => {
  await wait(400)
  await imagesReady()
})
await clickOn(page.locator('#gallery button').first(), 700)
await wait(1100)
await clickOn(next, 600)
await wait(800)
await clickOn(page.locator('button[aria-label="תמונה קודמת"]'), 500)
await wait(800)
await clickOn(page.locator('button[aria-label="סגור"]'), 600)
await wait(500)
await moveTo(W / 2 + 200, H / 2, 400)
await fast(5, () => scrollToBottom(700))
await wait(300)

log('מחירון דרך התפריט')
const atPricing = () =>
  page.waitForFunction(() => {
    const r = document.querySelector('#pricing')?.getBoundingClientRect()
    return r && Math.abs(r.top) < 40
  }, null, { timeout: 2500 }).then(() => true, () => false)
await clickOn(navBtn('מחירון'), 700)
await page.waitForURL(`${BASE}/`, { waitUntil: 'commit' })
// מחכים שהגלילה של האתר תיגמר
await page.waitForFunction(() => new Promise((r) => {
  const y = scrollY
  setTimeout(() => r(Math.abs(scrollY - y) < 1), 350)
}), null, { timeout: 8000 }).catch(() => {})
if (!(await atPricing())) {
  // כמו משתמש: לוחצים שוב על "מחירון" בתפריט
  await clickOn(navBtn('מחירון'), 300)
  await atPricing()
}
await wait(400)
const priceBtn = page.locator('#pricing button').first()
await hoverOn(priceBtn, 600, 600)
await clickOn(priceBtn, 200)
await wait(1700)
await clickOn(page.locator('button[aria-label="סגור"]').last(), 600)
await wait(500)
await clickOn(page.getByRole('button', { name: 'הורדת מחירון' }), 600)
await wait(500)

log('שאלו אותי -> טופס')
await clickOn(page.getByRole('button', { name: 'שאלו אותי' }), 500)
await wait(1300)
await fast(1.6, async () => {
  await clickOn(page.locator('#name'), 600)
  await typeHuman('מיכל לוי')
  await clickOn(page.locator('#email'), 450)
  await typeHuman('michal@example.com')
  await clickOn(page.locator('#phone'), 400)
  await typeHuman('050-1234567')
  await clickOn(page.locator('#message'), 450)
  await typeHuman('אשמח לפרטים על סשן משפחתי')
})
await hoverOn(page.locator('form button[type="submit"]'), 500, 700)

log('פרטי קשר ופוטר')
await hoverOn(page.locator('#contact a').first(), 600, 600)
await scrollToBottom(900)
await moveTo(W / 2, H - 150, 800)
await wait(2200)

} catch (e) {
  await page.screenshot({ path: `${OUT_DIR}/error.png` })
  await context.close()
  await browser.close()
  throw e
}

const total = (Date.now() - t0) / 1000
const video = page.video()
await context.close()
await browser.close()

const raw = await video.path()
fs.writeFileSync(
  path.join(OUT_DIR, 'meta.json'),
  JSON.stringify({ raw, trimStart, total, segments }, null, 2),
)
console.log(`recorded ${total.toFixed(1)}s → ${raw}`)
