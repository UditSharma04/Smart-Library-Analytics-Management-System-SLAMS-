import { motion } from 'framer-motion'
import Container from '../../../../components/common/Container'
import Button from '../../../../components/common/Button'

const demoFeatures = [
  { id: 'entrance', label: 'Smart Entrance', x: '20%', y: '50%' },
  { id: 'checkout', label: 'Self Checkout', x: '40%', y: '30%' },
  { id: 'study', label: 'Study Areas', x: '60%', y: '40%' },
  { id: 'security', label: 'Security Gates', x: '80%', y: '60%' }
]

const appScreens = [
  {
    title: 'Quick Checkout',
    description: 'Scan and go with our mobile QR system',
    image: '/mockups/quick-checkout.png'
  },
  {
    title: 'Space Finder',
    description: 'Find available study spaces in real-time',
    image: '/mockups/space-finder.png'
  },
  {
    title: 'Smart Notifications',
    description: 'Get timely reminders and updates',
    image: '/mockups/notifications.png'
  }
]

export default function InteractiveDemo() {
  return (
    <section className="section-padding bg-gray-50">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Library Layout Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
              {/* Library Layout Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              
              {/* Interactive Hotspots */}
              {demoFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  className="absolute"
                  style={{ left: feature.x, top: feature.y }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-accent rounded-full animate-ping absolute" />
                    <div className="w-4 h-4 bg-accent rounded-full relative" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        {feature.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mobile App Preview */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-4xl font-heading font-bold text-primary mb-4">
                Experience the Future Today
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Take a virtual tour of our smart library system and discover how it transforms the traditional library experience
              </p>
              <Button variant="primary">
                Download Mobile App
              </Button>
            </motion.div>

            <div className="space-y-6">
              {appScreens.map((screen, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                    {screen.title}
                  </h3>
                  <p className="text-gray-600">
                    {screen.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
} 