import { motion } from 'framer-motion'
import { useState } from 'react'
import Container from '../../../../components/common/Container'
import Button from '../../../../components/common/Button'
import {
  BuildingLibraryIcon,
  QrCodeIcon,
  UserGroupIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    id: 'library',
    label: 'Smart Library',
    icon: BuildingLibraryIcon,
    description: 'AI-powered library management system',
    stats: [
      { label: 'Books Managed', value: '50,000+' },
      { label: 'Daily Users', value: '1,000+' }
    ],
    position: { x: '50%', y: '20%' }
  },
  {
    id: 'checkout',
    label: 'QR Checkout',
    icon: QrCodeIcon,
    description: 'Scan & go in under 30 seconds',
    demo: {
      type: 'animation',
      steps: ['Scan QR', 'Verify ID', 'Confirmed!']
    },
    position: { x: '20%', y: '40%' }
  },
  {
    id: 'spaces',
    label: 'Study Spaces',
    icon: UserGroupIcon,
    description: 'Real-time space availability',
    demo: {
      type: 'occupancy',
      data: {
        quiet: 75,
        group: 45,
        computer: 60
      }
    },
    position: { x: '80%', y: '40%' }
  },
  {
    id: 'analytics',
    label: 'Live Analytics',
    icon: ChartBarIcon,
    description: 'Track library metrics in real-time',
    demo: {
      type: 'chart',
      data: [30, 45, 80, 65, 45, 70]
    },
    position: { x: '30%', y: '70%' }
  },
  {
    id: 'academic',
    label: 'Academic Tools',
    icon: AcademicCapIcon,
    description: 'Research assistance and citation tools',
    demo: {
      type: 'tools',
      items: ['Citation Generator', 'Research Guide', 'Study Timer']
    },
    position: { x: '70%', y: '70%' }
  }
]

export default function InteractiveDemo() {
  const [activeFeature, setActiveFeature] = useState(null)
  const [demoStep, setDemoStep] = useState(0)

  const simulateCheckout = () => {
    setDemoStep(0)
    const simulation = setInterval(() => {
      setDemoStep(prev => {
        if (prev >= 2) {
          clearInterval(simulation)
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }

  return (
    <section className="section-padding bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            Experience Next-Gen Library
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive demonstration of our smart library ecosystem
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Interactive Visualization */}
          <div className="relative aspect-square">
            {/* Central Hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <BuildingLibraryIcon className="w-16 h-16 text-white" />
              </motion.div>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {features.map(feature => (
                <g key={feature.id}>
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    className="stroke-primary/20"
                    strokeWidth="2"
                    fill="none"
                    d={`M 50% 50% L ${feature.position.x} ${feature.position.y}`}
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    cx={feature.position.x}
                    cy={feature.position.y}
                    r="4"
                    className="fill-primary/30"
                  />
                </g>
              ))}
            </svg>

            {/* Feature Nodes */}
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute"
                style={{ left: feature.position.x, top: feature.position.y }}
              >
                <div 
                  className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(feature)}
                  onMouseLeave={() => setActiveFeature(null)}
                  onClick={() => feature.id === 'checkout' && simulateCheckout()}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center group hover:bg-primary transition-colors"
                  >
                    <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </motion.div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {feature.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              {activeFeature ? (
                <>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-3">
                    {activeFeature.label}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeFeature.description}
                  </p>

                  {/* Feature-specific demo content */}
                  {activeFeature.stats && (
                    <div className="grid grid-cols-2 gap-4">
                      {activeFeature.stats.map(stat => (
                        <div key={stat.label} className="text-center">
                          <div className="text-2xl font-bold text-primary">{stat.value}</div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeFeature.demo?.type === 'animation' && (
                    <div className="flex justify-around items-center h-20">
                      {activeFeature.demo.steps.map((step, index) => (
                        <motion.div
                          key={step}
                          animate={{
                            scale: demoStep === index ? 1.1 : 1,
                            opacity: demoStep === index ? 1 : 0.5
                          }}
                          className="text-center"
                        >
                          <div className={`w-3 h-3 rounded-full mb-2 mx-auto ${
                            demoStep >= index ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-sm font-medium">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeFeature.demo?.type === 'occupancy' && (
                    <div className="space-y-3">
                      {Object.entries(activeFeature.demo.data).map(([zone, level]) => (
                        <div key={zone} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{zone} Zone</span>
                            <span>{level}% Full</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${level}%` }}
                              className={`h-full rounded-full ${
                                level > 80 ? 'bg-red-500' : level > 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeFeature.demo?.type === 'tools' && (
                    <div className="space-y-3">
                      {activeFeature.demo.items.map((item) => (
                        <div
                          key={item}
                          className="bg-gray-50 p-3 rounded-lg flex items-center gap-3"
                        >
                          <AcademicCapIcon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <BuildingLibraryIcon className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Hover over any feature to see details
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
} 