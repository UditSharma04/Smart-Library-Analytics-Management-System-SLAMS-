import { motion } from 'framer-motion'
import Container from '../../../../components/common/Container'

const features = [
  {
    title: 'Study Space Finder',
    description: 'Find and reserve available study rooms and quiet spaces instantly',
    icon: '📚',
    stats: 'Real-time availability'
  },
  {
    title: 'Quick Checkout',
    description: 'Borrow books using your student ID or mobile app',
    icon: '📱',
    stats: 'Contactless checkout'
  },
  {
    title: 'Digital Resources',
    description: 'Access e-books, journals, and research papers online',
    icon: '💻',
    stats: '24/7 access'
  }
]

export default function FeaturesShowcase() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-primary mb-4">
            Smart Features for Students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for a seamless library experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="hover-card"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="text-secondary font-mono font-semibold">
                  {feature.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-secondary/10 rounded-full px-6 py-2 text-secondary font-semibold">
            Trusted by 50+ Libraries Worldwide
          </div>
        </motion.div>
      </Container>
    </section>
  )
} 