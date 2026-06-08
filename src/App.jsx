import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Gallery from './components/Gallery'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useScrollTo } from './hooks/useScrollTo'

export default function App() {
  const scrollTo = useScrollTo()

  return (
    <div className="min-h-screen bg-white text-stone-800">
      <Navbar onNavigate={scrollTo} />
      <main>
        <Hero onNavigate={scrollTo} />
        <Gallery />
        <About />
        <Pricing onNavigate={scrollTo} />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
