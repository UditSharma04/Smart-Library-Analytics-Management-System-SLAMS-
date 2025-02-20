import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const activities = [
  {
    id: 1,
    type: 'borrow',
    icon: BookOpenIcon,
    title: 'Borrowed "Clean Code"',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'return',
    icon: ArrowLeftIcon,
    title: 'Returned "JavaScript Patterns"',
    time: '1 day ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'space',
    icon: UserGroupIcon,
    title: 'Booked Study Room A1',
    time: '2 days ago',
    status: 'pending'
  },
  {
    id: 4,
    type: 'fine',
    icon: CurrencyDollarIcon,
    title: 'Paid Fine ₹30',
    time: '3 days ago',
    status: 'success'
  }
]

const statusColors = {
  success: 'bg-green-500',
  pending: 'bg-yellow-500',
  error: 'bg-red-500'
}

export default function ActivityTimeline() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6">
        Recent Activity
      </h2>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className={`relative mt-1`}>
              <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center`}>
                <activity.icon className="w-4 h-4 text-primary" />
              </div>
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-16 ${index === activities.length - 1 ? 'hidden' : 'bg-gray-200'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-800">
                  {activity.title}
                </h3>
                <span className={`w-2 h-2 rounded-full ${statusColors[activity.status]}`} />
              </div>
              <p className="text-sm text-gray-500">
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 