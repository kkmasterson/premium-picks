import { AnnouncementBar } from '@/features/landing/sections/AnnouncementBar'
import { Navbar } from '@/features/landing/sections/Navbar'
import { Hero } from '@/features/landing/sections/Hero'
import { ProductPreview } from '@/features/landing/sections/ProductPreview'
import { Features } from '@/features/landing/sections/Features'
import { Workflow } from '@/features/landing/sections/Workflow'
import { SportsCoverage } from '@/features/landing/sections/SportsCoverage'
import { Comparison } from '@/features/landing/sections/Comparison'
import { Pricing } from '@/features/landing/sections/Pricing'
import { FAQ } from '@/features/landing/sections/FAQ'
import { FinalCTA } from '@/features/landing/sections/FinalCTA'
import { Footer } from '@/features/landing/sections/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <Features />
        <Workflow />
        <SportsCoverage />
        <Comparison />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
