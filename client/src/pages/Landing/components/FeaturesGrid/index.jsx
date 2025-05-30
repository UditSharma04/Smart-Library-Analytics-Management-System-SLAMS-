import { motion } from 'framer-motion'
import Container from '../../../../components/common/Container'
import {
  QrCodeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  MapIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: QrCodeIcon,
    title: 'Self-Service Kiosks',
    description: 'Quick and easy checkout process with QR code scanning',
    stat: '2 min average checkout time',
    color: 'bg-blue-500'
  },
  {
    icon: ChartBarIcon,
    title: 'Real-time Analytics',
    description: 'Track library usage and optimize resource allocation',
    stat: 'Live occupancy tracking',
    color: 'bg-green-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Smart Security',
    description: 'Advanced RFID tracking and automated exit verification',
    stat: '99.9% accuracy rate',
    color: 'bg-purple-500'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Integration',
    description: 'Access library services from your smartphone',
    stat: '10k+ active users',
    color: 'bg-pink-500'
  },
  {
    icon: MapIcon,
    title: 'Resource Tracking',
    description: 'Monitor book locations and availability in real-time',
    stat: 'Instant book locator',
    color: 'bg-yellow-500'
  },
  {
    icon: BellAlertIcon,
    title: 'Smart Notifications',
    description: 'Automated reminders and updates for due dates',
    stat: 'Zero overdue books',
    color: 'bg-red-500'
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.color} bg-opacity-10 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <div className="text-sm font-medium text-primary">
                {feature.stat}
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
          {/* <div className="inline-block bg-accent/10 px-6 py-2 rounded-full">
            <span className="text-accent font-semibold">
              Trusted by Leading Educational Institutions
            </span>
          </div> */}
        </motion.div>
      </Container>
    </section>
  )
} 