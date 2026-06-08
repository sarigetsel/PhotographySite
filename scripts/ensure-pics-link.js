import { existsSync, symlinkSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const picsSrc = join(root, 'pics')
const picsLink = join(root, 'public', 'pics')

if (!existsSync(picsSrc)) {
  console.warn('pics/ folder not found — skipping link setup')
  process.exit(0)
}

if (existsSync(picsLink)) {
  process.exit(0)
}

mkdirSync(join(root, 'public'), { recursive: true })

try {
  symlinkSync(picsSrc, picsLink, 'junction')
  console.log('Created public/pics → pics junction')
} catch (err) {
  console.warn('Could not create junction:', err.message)
  console.warn('Run: mklink /J public\\pics pics')
}
