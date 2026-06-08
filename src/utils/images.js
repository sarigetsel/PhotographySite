const PIC_COUNT = 124

export function getPicPath(index) {
  return `/pics/pic (${index}).jpg`
}

export function getAllPicPaths() {
  return Array.from({ length: PIC_COUNT }, (_, i) => getPicPath(i + 1))
}

export const LOGO_PATH = '/pics/logo.png'

export const PRICE_PATHS = ['/pics/price.png', '/pics/price.jpg']

export const HERO_SLIDES = [1, 12, 24, 36, 48, 60, 72, 84, 96, 108].map(getPicPath)
