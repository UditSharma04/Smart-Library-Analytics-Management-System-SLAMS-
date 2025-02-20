import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const stats = [
  {
    icon: BookOpenIcon,
    label: 'Borrowed Books',
    value: '3',
    trend: '+1 this week',
    trendUp: true
  },
  {
    icon: ClockIcon,
    label: 'Due Soon',
    value: '1',
    trend: 'Due in 2 days',
    trendUp: false
  },
  {
    icon: UserGroupIcon,
    label: 'Study Spaces',
    value: '12',
    trend: 'Available now',
    trendUp: true
  },
  {
    icon: CurrencyDollarIcon,
    label: 'Total Fines',
    value: '₹50',
    trend: 'Pending payment',
    trendUp: false
  }
]

export default function QuickStats() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            <span className={`text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {stat.trend}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold font-mono">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 