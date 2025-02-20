import { motion } from 'framer-motion'
import Container from '../../../../components/common/Container'

const features = [
  {
    icon: '🔄',
    title: 'Self-Service Kiosks',
    description: 'Quick and easy checkout process with QR code scanning',
    stat: '2 min average checkout time'
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    description: 'Track library usage and optimize resource allocation',
    stat: 'Live occupancy tracking'
  },
  {
    icon: '🔒',
    title: 'Smart Security',
    description: 'Advanced RFID tracking and automated exit verification',
    stat: '99.9% accuracy rate'
  },
  {
    icon: '📱',
    title: 'Mobile Integration',
    description: 'Access library services from your smartphone',
    stat: '10k+ active users'
  },
  {
    icon: '🎯',
    title: 'Resource Tracking',
    description: 'Monitor book locations and availability in real-time',
    stat: 'Instant book locator'
  },
  {
    icon: '📨',
    title: 'Smart Notifications',
    description: 'Automated reminders and updates for due dates',
    stat: 'Zero overdue books'
  }
]

export default function FeaturesGrid() {
  return (
    <section className="section-padding bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-primary mb-4">
            Comprehensive Library Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to run a modern, efficient library system
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="inline-block bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-primary">
                      {feature.stat}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-accent/10 px-6 py-2 rounded-full">
            <span className="text-accent font-semibold">
              Trusted by Leading Educational Institutions
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  )
} 