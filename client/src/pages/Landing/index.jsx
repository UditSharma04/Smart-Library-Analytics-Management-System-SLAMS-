import HeroSection from './components/HeroSection'
import FeaturesShowcase from './components/FeaturesShowcase'
import UserBenefits from './components/UserBenefits'
import InteractiveDemo from './components/InteractiveDemo'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import FeaturesGrid from './components/FeaturesGrid'
import CallToAction from './components/CallToAction'

export default function Landing() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <FeaturesShowcase />
      <UserBenefits />
      <InteractiveDemo />
      <AnalyticsDashboard />
      <FeaturesGrid />
      <CallToAction />
    </main>
  )
} 