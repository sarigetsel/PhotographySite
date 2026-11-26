// קונפיג זמני להקלטת הדמו: אותו אתר, תמונות מוקטנות מתיקייה חיצונית
import base from './vite.config.js'
export default { ...base, publicDir: process.env.DEMO_PUBLIC_DIR }
