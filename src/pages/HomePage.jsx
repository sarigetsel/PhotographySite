import Hero from '../components/Hero'
import QuoteSection from '../components/QuoteSection'
import About from '../components/About'
import ProcessSection from '../components/ProcessSection'
import GalleryTeaser from '../components/GalleryTeaser'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'

export default function HomePage({ onNavigate }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <QuoteSection />
      <About />
      <ProcessSection />
      <GalleryTeaser />
      <Pricing onNavigate={onNavigate} />
      <Contact />
    </>
  )
}
