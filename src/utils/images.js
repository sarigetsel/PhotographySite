const PIC_COUNT = 174
const BASE = import.meta.env.BASE_URL

function asset(path) {
  const encoded = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `${BASE}${encoded}`
}

export function getPicPath(index) {
  return asset(`pics/pic (${index}).jpg`)
}

export function getAllPicPaths() {
  return Array.from({ length: PIC_COUNT }, (_, i) => getPicPath(i + 1))
}

export function getOutdoorPicPath(index) {
  return asset(`pics/out/out (${index}).jpg`)
}

export function getAllOutdoorPicPaths() {
  return Array.from({ length: 155 }, (_, i) => getOutdoorPicPath(i + 1))
}

export const LOGO_PATH = asset('pics/logo.png')

export const PRICE_PATHS = [asset('pics/price.jpg'), asset('pics/price.png')]

export const HERO_SLIDES = [1, 12, 24, 36, 48, 60, 72, 84, 96, 108].map(getPicPath)
