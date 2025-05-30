import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

function QuickStats({ borrowedCount = 0, dueSoonCount = 0, readingProgress = 0, totalFines = {} }) {
  const navigate = useNavigate()
  
  console.log('QuickStats Props:', { borrowedCount, dueSoonCount, readingProgress, totalFines })
  
  const formatFine = (amount = 0) => `₹${Number(amount).toFixed(2)}`
  
  const {
    total = 0,
    overdue = 0,
    damage = 0,
    unpaid = 0
  } = totalFines

  console.log('Destructured Fines:', { total, overdue, damage, unpaid })

  const stats = [
    {
      icon: BookOpenIcon,
      label: 'Books Borrowed',
      value: borrowedCount,
      trend: `${borrowedCount > 0 ? '+1' : 'No'} changes this week`,
      trendUp: borrowedCount > 0,
      color: 'bg-blue-500'
    },
    {
      icon: ClockIcon,
      label: 'Due Soon',
      value: dueSoonCount,
      trend: dueSoonCount > 0 ? `${dueSoonCount} books due soon` : 'No books due soon',
      trendUp: dueSoonCount === 0,
      color: 'bg-yellow-500'
    },
    {
      icon: ChartBarIcon,
      label: 'Reading Progress',
      value: `${readingProgress}%`,
      trend: `${readingProgress > 80 ? 'Great progress!' : 'Keep reading!'}`,
      trendUp: readingProgress > 80,
      color: 'bg-green-500'
    },
    {
      icon: CurrencyDollarIcon,
      label: 'Total Fines',
      value: formatFine(total),
      subValues: total > 0 ? [
        { label: 'Overdue', value: formatFine(overdue) },
        { label: 'Damage', value: formatFine(damage) },
        { label: 'Unpaid', value: formatFine(unpaid) }
      ] : null,
      trend: total > 0 ? 'Click to pay now' : 'No pending fines',
      trendUp: total === 0,
      color: 'bg-red-500',
      onClick: () => navigate('/fines')
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow 
            ${stat.onClick ? 'cursor-pointer' : ''}`}
          onClick={stat.onClick}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 ${stat.color}/10 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color} text-white`} />
            </div>
            <span className={`text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'} 
              flex items-center gap-1`}
            >
              {stat.trend}
              {stat.trendUp ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : (
                <ClockIcon className="w-4 h-4" />
              )}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold font-mono">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
            {stat.subValues && (
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                {stat.subValues.map(subValue => (
                  <div key={subValue.label} className="flex justify-between text-xs">
                    <span className="text-gray-500">{subValue.label}:</span>
                    <span className="font-mono">{subValue.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default QuickStats 