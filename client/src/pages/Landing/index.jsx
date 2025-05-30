import { motion } from 'framer-motion'
import HeroSection from './components/HeroSection'
import FeaturesShowcase from './components/FeaturesShowcase'
import InteractiveDemo from './components/InteractiveDemo'
import NavigationPreview from './components/NavigationPreview'
import FeaturesGrid from './components/FeaturesGrid'
import AnalyticsDashboard from './components/AnalyticsDashboard'

export default function Landing() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <FeaturesShowcase />
      </motion.div>
      <NavigationPreview />
      <InteractiveDemo />
      <FeaturesGrid />
      <AnalyticsDashboard />
    </main>
  )
} 