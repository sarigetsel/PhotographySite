import { cpSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const picsSrc = join(root, 'pics')
const picsLink = join(root, 'public', 'pics')

if (!existsSync(picsSrc)) {
  console.warn('pics/ folder not found — skipping link setup')
} else if (!existsSync(picsLink)) {
  mkdirSync(join(root, 'public'), { recursive: true })

  try {
    cpSync(picsSrc, picsLink, { recursive: true })
    console.log('Copied pics/ to public/pics/')
  } catch (err) {
    console.warn('Could not copy pics to public/pics:', err.message)
  }
}