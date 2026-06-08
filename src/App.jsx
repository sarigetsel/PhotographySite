import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CameraCursor from './components/CameraCursor'
import ScrollProgress, { BackToTop } from './components/ScrollProgress'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import { useScrollTo } from './hooks/useScrollTo'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  const scrollTo = useScrollTo()

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <CameraCursor />
      <ScrollProgress />
      <ScrollToTop />
      <Navbar onNavigate={scrollTo} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={scrollTo} />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
