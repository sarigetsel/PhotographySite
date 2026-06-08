import { copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, symlinkSync } from 'fs'
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
  const linkType = process.platform === 'win32' ? 'junction' : 'dir'
  symlinkSync(picsSrc, picsLink, linkType)
  console.log('Created public/pics → pics link')
} catch {
  cpSync(picsSrc, picsLink, { recursive: true })
  console.log('Copied pics/ to public/pics/')
}
