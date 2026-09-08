import { Navbar } from '@/features/landing/sections/Navbar'
import { Hero } from '@/features/landing/sections/Hero'
import { Workflow } from '@/features/landing/sections/Workflow'
import { Features } from '@/features/landing/sections/Features'
import { SportsCoverage } from '@/features/landing/sections/SportsCoverage'
import { Pricing } from '@/features/landing/sections/Pricing'
import { FAQ } from '@/features/landing/sections/FAQ'
import { FinalCTA } from '@/features/landing/sections/FinalCTA'
import { Footer } from '@/features/landing/sections/Footer'
import './landing.css'

function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-ink-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <SportsCoverage />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
