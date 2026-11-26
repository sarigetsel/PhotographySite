// עורך את ההקלטה הגולמית מ-capture-demo.mjs לסרטון MP4 קל:
// חותך את שלב הטעינה המוקדמת, מאיץ את קטעי הגלילה בגלריות ודוחס ל-H.264.
// שימוש: node scripts/render-demo.mjs [output.mp4]
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const meta = JSON.parse(fs.readFileSync('demo-raw/meta.json', 'utf8'))
const out = process.argv[2] || 'demo.mp4'
const FPS = 25

// בניית רשימת קטעים: רגיל / מואץ
const pieces = []
let cursor = meta.trimStart
for (const seg of meta.segments) {
  if (seg.start > cursor) pieces.push({ start: cursor, end: seg.start, speed: 1 })
  pieces.push(seg)
  cursor = seg.end
}
pieces.push({ start: cursor, end: meta.total - 0.2, speed: 1 })

const outDur = pieces.reduce((t, p) => t + (p.end - p.start) / p.speed, 0)
const parts = pieces.map(
  (p, i) =>
    `[0:v]trim=start=${p.start.toFixed(3)}:end=${p.end.toFixed(3)},setpts=(PTS-STARTPTS)/${p.speed},fps=${FPS}[v${i}]`,
)
const concat = `${pieces.map((_, i) => `[v${i}]`).join('')}concat=n=${pieces.length}:v=1:a=0,` +
  `fade=t=in:st=0:d=0.6,fade=t=out:st=${(outDur - 0.8).toFixed(2)}:d=0.8,format=yuv420p[out]`

// פסקול (פסנתר + ציפורים) נוצר באורך המדויק של הסרטון
const MUSIC = 'demo-raw/music.wav'
execFileSync('python', ['scripts/make-music.py', outDur.toFixed(2), MUSIC], { stdio: 'inherit' })

execFileSync(
  'ffmpeg',
  [
    '-y', '-v', 'error', '-i', meta.raw, '-i', MUSIC,
    '-filter_complex', [...parts, concat].join(';'),
    '-map', '[out]', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
    '-c:a', 'aac', '-b:a', '112k',
    '-shortest', '-movflags', '+faststart',
    out,
  ],
  { stdio: 'inherit' },
)

const mb = fs.statSync(out).size / 1024 / 1024
console.log(`${out}: ${outDur.toFixed(1)}s, ${mb.toFixed(1)} MB`)
