import { motion } from 'framer-motion'
import { useState } from 'react'
import Container from '../../../../components/common/Container'
import {
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: 'Smart Checkout',
    description: 'Scan & go with QR codes - checkout in under 30 seconds',
    icon: BookOpenIcon,
    stats: '2 min average checkout',
    color: 'blue',
    demo: {
      type: 'animation',
      steps: ['Scan Book', 'Verify ID', 'Done!']
    }
  },
  {
    title: 'Study Space Finder',
    description: 'Real-time availability of study rooms and quiet zones',
    icon: UserGroupIcon,
    stats: '100+ study spaces',
    color: 'green',
    demo: {
      type: 'occupancy',
      data: {
        quiet: 65,
        group: 80,
        computer: 45
      }
    }
  },
  {
    title: 'Digital Resources',
    description: 'Access e-books and journals from anywhere, anytime',
    icon: DevicePhoneMobileIcon,
    stats: '50k+ resources',
    color: 'purple',
    demo: {
      type: 'resources',
      items: ['E-Books', 'Journals', 'Research Papers']
    }
  }
]

export default function FeaturesShowcase() {
  const [activeFeature, setActiveFeature] = useState(null)
  const [demoStep, setDemoStep] = useState(0)

  const getColorClasses = (color) => ({
    blue: {
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
      icon: 'bg-blue-500'
    },
    green: {
      light: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:bg-green-100',
      icon: 'bg-green-500'
    },
    purple: {
      light: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100',
      icon: 'bg-purple-500'
    }
  }[color])

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Intelligent Library Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience next-generation library management with our smart features
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color)
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative group rounded-2xl p-6 ${colors.light} border ${colors.border} ${colors.hover} transition-all duration-300`}
                onMouseEnter={() => {
                  setActiveFeature(feature)
                  if (feature.demo?.type === 'animation') {
                    setDemoStep(0)
                  }
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-lg ${colors.icon} bg-opacity-10 flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className={`text-xl font-heading font-semibold ${colors.text} mb-2`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>

                {/* Demo Section */}
                <div className="mt-6 h-24">
                  {feature.demo?.type === 'animation' && activeFeature?.title === feature.title && (
                    <div className="flex justify-between items-center">
                      {feature.demo.steps.map((step, idx) => (
                        <motion.div
                          key={step}
                          animate={{
                            scale: demoStep === idx ? 1.1 : 1,
                            opacity: demoStep >= idx ? 1 : 0.5
                          }}
                          className="text-center"
                        >
                          <div className={`w-3 h-3 rounded-full mb-2 mx-auto ${
                            demoStep >= idx ? colors.icon : 'bg-gray-200'
                          }`} />
                          <span className="text-sm font-medium">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {feature.demo?.type === 'occupancy' && activeFeature?.title === feature.title && (
                    <div className="space-y-2">
                      {Object.entries(feature.demo.data).map(([zone, level]) => (
                        <div key={zone} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{zone}</span>
                            <span>{level}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${level}%` }}
                              className={`h-full rounded-full ${colors.icon}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {feature.demo?.type === 'resources' && activeFeature?.title === feature.title && (
                    <div className="grid grid-cols-3 gap-2">
                      {feature.demo.items.map((item) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`text-center p-2 rounded ${colors.light} ${colors.text} text-sm`}
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="absolute bottom-4 right-4">
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {feature.stats}
                  </span>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 ${colors.icon} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
} 