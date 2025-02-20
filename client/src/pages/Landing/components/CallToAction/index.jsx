import { motion } from 'framer-motion'
import Container from '../../../../components/common/Container'
import Button from '../../../../components/common/Button'

const benefits = [
  'Free 30-day trial period',
  'Dedicated support team',
  'Easy integration process',
  'Custom setup assistance'
]

export default function CallToAction() {
  return (
    <section className="section-padding bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold">FOR OTHER LIBRARIES</span>
          <h2 className="text-4xl font-heading font-bold text-primary mt-4 mb-4">
            Want This System For Your Library?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our smart library management system can be customized for any educational institution
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-heading font-semibold text-primary mb-6">
                System Features
              </h3>
              <ul className="space-y-4 mb-8">
                {[
                  'Smart Space Management',
                  'Automated Check-in/out',
                  'Real-time Analytics',
                  'Student Mobile App',
                  'Custom Integration Options'
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-gray-700"
                  >
                    <svg
                      className="w-5 h-5 text-accent mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pl-12"
          >
            <div className="bg-primary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-heading font-semibold mb-6">
                Request Demo
              </h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Institution Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/50 focus:outline-none focus:border-accent">
                    <option value="">Select Library Size</option>
                    <option value="small">Small (&lt; 10,000 books)</option>
                    <option value="medium">Medium (10,000 - 50,000 books)</option>
                    <option value="large">Large (&gt; 50,000 books)</option>
                  </select>
                </div>
                <Button variant="accent" className="w-full">
                  Schedule Demo
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
} 