import { motion } from 'framer-motion'
import Container from '../../../../components/common/Container'

const analyticsData = [
  {
    title: 'Study Spaces',
    type: 'chart',
    data: {
      labels: ['Quiet Zone', 'Group Study', 'Computer Lab', 'Reading Area'],
      values: [75, 85, 60, 90]
    }
  },
  {
    title: 'Peak Hours',
    type: 'timeline',
    data: {
      morning: 45,
      afternoon: 85,
      evening: 95,
      night: 35
    }
  },
  {
    title: 'Popular Resources',
    type: 'stats',
    data: [
      { label: 'Engineering', value: '35%' },
      { label: 'Computer Science', value: '30%' },
      { label: 'Business', value: '20%' },
      { label: 'Sciences', value: '15%' }
    ]
  }
]

export default function AnalyticsDashboard() {
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
            Smart Analytics Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Make data-driven decisions with our comprehensive analytics system
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Space Utilization Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-heading font-semibold text-primary mb-4">
              Space Utilization
            </h3>
            <div className="space-y-4">
              {analyticsData[0].data.labels.map((label, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span className="font-mono">{analyticsData[0].data.values[index]}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${analyticsData[0].data.values[index]}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Peak Hours Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-heading font-semibold text-primary mb-4">
              Peak Hours
            </h3>
            <div className="relative h-48">
              {Object.entries(analyticsData[1].data).map(([time, value], index) => (
                <motion.div
                  key={time}
                  className="absolute bottom-0 bg-secondary/20 rounded-t-lg w-1/4"
                  style={{ 
                    left: `${index * 25}%`,
                    height: `${value}%`
                  }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-mono">
                    {value}%
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm capitalize">
                    {time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Popular Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-heading font-semibold text-primary mb-4">
              Popular Categories
            </h3>
            <div className="space-y-6">
              {analyticsData[2].data.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-lg font-mono font-semibold text-secondary">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
} 