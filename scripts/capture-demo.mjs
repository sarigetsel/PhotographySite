// מקליט סרטון הדגמה של האתר: כל התמונות, הגלריות, ה-lightbox, המחירון וטופס יצירת הקשר.
// שימוש: npm run dev -- --port 5174 --strictPort  ואז  node scripts/capture-demo.mjs
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

// אופציונלי: הגשת אותן תמונות בגרסה מוקטנת כדי שההקלטה לא תיתקע בטעינה
const SMALL = process.env.DEMO_SMALL_DIR
if (SMALL) {
  await context.route(/\/pics\/.+\.jpe?g$/i, async (route) => {
    const rel = decodeURIComponent(new URL(route.request().url()).pathname).replace(/^.*?\/pics\//, '')
    const file = path.join(SMALL, rel)
    if (!fs.existsSync(file)) return route.continue()
    await route.fulfill({
      status: 200,
      body: fs.readFileSync(file),
      headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' },
    })
  })
}
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
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
await page.mouse.move(W - 120, H - 80)
await page.waitForTimeout(400)
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
        const step = (now) => {
          const t = Math.min(1, (now - t0) / dur)
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
          window.scrollTo({ top: from + dist * e, behavior: 'instant' })
          if (t < 1) requestAnimationFrame(step)
          else resolve()
        }
        requestAnimationFrame(step)
        setTimeout(() => {
          window.scrollTo({ top: to, behavior: 'instant' })
          resolve()
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
      return imgs.length >= Math.min(n, 4) && imgs.every((i) => i.complete && i.naturalWidth > 0)
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
    await wait(45 + Math.random() * 45)
  }
}

try {
// ================= דף הבית =================
log('================= דף הבית =================')
await moveTo(W / 2 + 60, H / 2 + 40, 900)
await wait(1200)

// מעבר בין שקופיות ה-Hero בעזרת הנקודות
log('מעבר בין שקופיות ה-Hero בעזרת הנקודות')
const dots = page.locator('button[aria-label^="שקף"]')
for (const i of [2, 4, 6, 8]) {
  await clickOn(dots.nth(i), 450)
  await wait(650)
}

// ריחוף על כפתורי ה-Hero
log('ריחוף על כפתורי ה-Hero')
await hoverOn(page.getByRole('button', { name: 'הזמינו סשן' }), 600, 500)
await hoverOn(page.locator('#home a[href$="/gallery"]'), 500, 600)
await moveTo(W / 2, H / 2 + 120, 500)

// גלילה לאורך הציטוט, אודות, תהליך העבודה
log('גלילה לאורך הציטוט, אודות, תהליך העבודה')
await scrollToSel('#about', 80, 1300)
await wait(1200)
await scrollBy(H * 1.6, 1300)
await wait(900)

// הקרוסלה של התמונות
log('הקרוסלה של התמונות')
await scrollToSel('.marquee-track', 200, 1300)
await moveTo(W / 2 - 200, H / 2 - 60, 700)
await wait(2600)

// ריחוף על כפתורי הגלריות
log('ריחוף על כפתורי הגלריות')
const galleryBtn = page.getByRole('link', { name: 'לגלריה המלאה' })
const outdoorBtn = page.getByRole('link', { name: /טבע וחופש/ })
await hoverOn(galleryBtn, 600, 500)
await hoverOn(outdoorBtn, 500, 600)

// מחירון: הגדלה, סגירה, הורדה
log('מחירון: הגדלה, סגירה, הורדה')
const priceBtn = page.locator('#pricing button').first()
await scrollToSel('#pricing button', 110, 1300)
await wait(700)
await hoverOn(priceBtn, 600, 700)
await clickOn(priceBtn, 300)
await wait(1800)
await clickOn(page.locator('button[aria-label="סגור"]').last(), 700)
await wait(700)
await scrollBy(260, 900)
await clickOn(page.getByRole('button', { name: 'הורדת מחירון' }), 700)
await wait(900)

// "שאלו אותי" -> גולל לצור קשר
log('"שאלו אותי" -> גולל לצור קשר')
await clickOn(page.getByRole('button', { name: 'שאלו אותי' }), 600)
await wait(1500)

// מילוי הטופס (בלי שליחה)
log('מילוי הטופס (בלי שליחה)')
await clickOn(page.locator('#name'), 700)
await typeHuman('מיכל לוי')
await clickOn(page.locator('#email'), 600)
await typeHuman('michal@example.com')
await clickOn(page.locator('#phone'), 500)
await typeHuman('050-1234567')
await clickOn(page.locator('#message'), 600)
await typeHuman('היי, אשמח לפרטים על סשן משפחתי')
await wait(500)
await hoverOn(page.locator('form button[type="submit"]'), 600, 700)

// פרטי קשר והפוטר
log('פרטי קשר והפוטר')
await hoverOn(page.locator('#contact a').first(), 700, 500)
await scrollToBottom(1300)
await wait(800)

// כפתור חזרה למעלה
log('כפתור חזרה למעלה')
const backTop = page.locator('button[aria-label="חזרה למעלה"]')
await clickOn(backTop, 800)
await waitScrollTop()
await wait(500)

// ================= הגלריה המלאה =================
log('================= הגלריה המלאה =================')
await clickOn(page.getByRole('button', { name: 'גלריה', exact: true }), 800)
await page.waitForURL('**/gallery', { waitUntil: 'commit' })
await imagesReady()

// פתיחת תמונה וניווט ב-lightbox
log('פתיחת תמונה וניווט ב-lightbox')
await clickOn(page.locator('#gallery button').first(), 700)
await wait(900)
const next = page.locator('button[aria-label="תמונה הבאה"]')
for (let i = 0; i < 3; i++) {
  await clickOn(next, i === 0 ? 600 : 200)
  await wait(500)
}
await page.keyboard.press('ArrowRight')
await wait(450)
await page.keyboard.press('ArrowRight')
await wait(450)
await clickOn(page.locator('button[aria-label="תמונה קודמת"]'), 700)
await wait(500)
await page.keyboard.press('Escape')
await wait(600)

// גלילה מהירה על כל 174 התמונות
log('גלילה מהירה על כל 174 התמונות')
await moveTo(W / 2 + 200, H / 2, 500)
await fast(3.2, () => scrollToBottom(700))
await wait(600)

// ================= צילומי חוץ =================
log('================= צילומי חוץ =================')
await clickOn(backTop, 700)
await waitScrollTop()
await clickOn(page.locator('main a', { hasText: 'חזרה לדף הבית' }), 800)
await page.waitForURL(`${BASE}/`, { waitUntil: 'commit' })
await wait(700)
await fast(2, () => scrollToSel('.marquee-track', 200, 1600))
await clickOn(page.getByRole('link', { name: /טבע וחופש/ }), 700)
await page.waitForURL('**/outdoor', { waitUntil: 'commit' })
await imagesReady()

await clickOn(page.locator('main section button').first(), 700)
await wait(900)
for (let i = 0; i < 3; i++) {
  await clickOn(next, i === 0 ? 600 : 200)
  await wait(500)
}
await page.keyboard.press('Escape')
await wait(600)

await moveTo(W / 2 - 200, H / 2, 500)
await fast(3.2, () => scrollToBottom(700))
await wait(600)

// ================= סיום: חזרה לבית דרך הלוגו =================
log('================= סיום: חזרה לבית דרך הלוגו =================')
await clickOn(page.locator('header a[aria-label="חזרה לדף הבית"]'), 900)
await page.waitForURL(`${BASE}/`, { waitUntil: 'commit' })
await wait(900)
if ((await scrollY()) > 10) {
  await clickOn(backTop, 800)
  await waitScrollTop()
}
await moveTo(W / 2, H / 2 + 40, 900)
await wait(2500)

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
