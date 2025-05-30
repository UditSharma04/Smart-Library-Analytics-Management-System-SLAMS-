import { motion } from 'framer-motion'
import Container from '../../../../components/common/Container'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const analyticsData = {
  occupancy: {
    labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
    datasets: [{
      label: 'Library Occupancy',
      data: [20, 45, 75, 85, 90, 70, 40],
      borderColor: '#3B82F6',
      tension: 0.4
    }]
  },
  resources: {
    labels: ['Engineering', 'Science', 'Technology', 'Literature'],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
    }]
  }
}

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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Occupancy Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">Daily Occupancy</h3>
            <Line data={analyticsData.occupancy} options={{ responsive: true }} />
          </motion.div>

          {/* Resource Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
            <Doughnut data={analyticsData.resources} options={{ responsive: true }} />
          </motion.div>
        </div>
      </Container>
    </section>
  )
} 