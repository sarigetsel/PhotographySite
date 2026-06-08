import { useEffect, useState } from 'react'
import { Camera } from 'lucide-react'
import { motion, useSpring } from 'framer-motion'

export default function CameraCursor() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const spring = { stiffness: 500, damping: 28, mass: 0.5 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    document.body.classList.add('custom-cursor')
    setVisible(true)

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.body.addEventListener('mouseleave', leave)
    document.body.addEventListener('mouseenter', enter)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.body.removeEventListener('mouseleave', leave)
      document.body.removeEventListener('mouseenter', enter)
    }
  }, [x, y])

  if (!visible) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ x, y }}
      >
        <motion.div
          animate={{ scale: clicking ? 0.85 : 1 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark/90 text-white shadow-lg ring-2 ring-brand-coral/50 backdrop-blur-sm"
        >
          <Camera size={18} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-coral"
        style={{ x, y }}
        animate={{ scale: clicking ? 1.8 : 1, opacity: clicking ? 0.5 : 0.9 }}
      />
    </>
  )
}
