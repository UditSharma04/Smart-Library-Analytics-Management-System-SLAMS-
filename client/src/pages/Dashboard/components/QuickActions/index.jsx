import { motion } from 'framer-motion'
import {
  ArrowPathIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const actions = [
  {
    icon: ArrowPathIcon,
    label: 'Renew Books',
    color: 'bg-blue-500'
  },
  {
    icon: CalendarIcon,
    label: 'Reserve Space',
    color: 'bg-green-500'
  },
  {
    icon: CurrencyDollarIcon,
    label: 'Pay Fines',
    color: 'bg-yellow-500'
  },
  {
    icon: DocumentArrowDownIcon,
    label: 'Get Receipt',
    color: 'bg-purple-500'
  },
  {
    icon: ExclamationTriangleIcon,
    label: 'Report Issue',
    color: 'bg-red-500'
  }
]

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center text-white`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
} 