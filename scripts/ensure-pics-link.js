import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const picsLink = join(__dirname, '..', 'public', 'pics')

// Just verify that public/pics exists — it should be copied manually or via CI
if (!existsSync(picsLink)) {
  console.warn('Note: public/pics not found. Images should be copied manually.')
} else {
  console.log('✓ public/pics found')
}