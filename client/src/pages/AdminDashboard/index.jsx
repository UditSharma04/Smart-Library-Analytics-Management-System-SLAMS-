import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  UsersIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserPlusIcon,
  DocumentCheckIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'
import { Line, Doughnut } from 'react-chartjs-2'
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

// Register ChartJS components
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

// Update the recentUsers data structure to match Users page
const recentUsers = [
  {
    id: '1',
    registerNumber: "22BCE1962",
    email: "udit.sharma2022@vitstudent.ac.in",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    borrowHistory: [
      {
        bookId: '1',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        borrowDate: '2024-01-15',
        returnDate: '2024-01-29',
        status: 'returned'
      }
    ]
  },
  {
    id: '2',
    registerNumber: "22BCE1963",
    email: "john.doe2022@vitstudent.ac.in",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    borrowHistory: [
      {
        bookId: '3',
        title: 'Refactoring',
        author: 'Martin Fowler',
        borrowDate: '2024-01-20',
        returnDate: '2024-02-03',
        status: 'overdue'
      }
    ]
  },
  {
    id: '3',
    registerNumber: "22BCE1964",
    email: "alice.johnson2022@vitstudent.ac.in",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    borrowHistory: [
      {
        bookId: '2',
        title: 'Design Patterns',
        author: 'Erich Gamma',
        borrowDate: '2024-02-01',
        returnDate: '2024-02-15',
        status: 'active'
      }
    ]
  }
]

export default function AdminDashboard() {
  const [stats] = useState({
    overview: {
      totalBooks: 5000,
      activeUsers: 1250,
      pendingIssues: 15,
      overdueBooks: 25
    },
    trends: {
      dailyBorrows: {
        count: 45,
        trend: 'up',
        percentage: 12
      },
      returns: {
        count: 38,
        trend: 'up',
        percentage: 8
      },
      newUsers: {
        count: 15,
        trend: 'up',
        percentage: 20
      },
      issues: {
        count: 8,
        trend: 'down',
        percentage: 15
      }
    },
    alerts: [
      {
        id: 1,
        type: 'overdue',
        message: '25 books are overdue',
        severity: 'high'
      },
      {
        id: 2,
        type: 'stock',
        message: 'Low stock alert for Computer Networks',
        severity: 'medium'
      },
      {
        id: 3,
        type: 'maintenance',
        message: 'Scheduled system maintenance tonight',
        severity: 'low'
      }
    ]
  })

  // Activity Graph Data
  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Borrows',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Returns',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      }
    ]
  }

  // Book Categories Data
  const categoryData = {
    labels: ['Technology', 'Science', 'Engineering', 'Literature', 'History'],
    datasets: [{
      data: [300, 250, 200, 150, 100],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(234, 179, 8, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(234, 179, 8, 1)'
      ],
      borderWidth: 1
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(156, 163, 175)'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  }

  const getMetricColor = (type) => {
    switch (type) {
      case 'books': return 'bg-blue-400/10 text-blue-400'
      case 'users': return 'bg-green-400/10 text-green-400'
      case 'issues': return 'bg-red-400/10 text-red-400'
      case 'overdue': return 'bg-yellow-400/10 text-yellow-400'
      default: return 'bg-gray-400/10 text-gray-400'
    }
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400'
  }

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-400 bg-red-400/5'
      case 'medium': return 'border-yellow-400 bg-yellow-400/5'
      case 'low': return 'border-blue-400 bg-blue-400/5'
      default: return 'border-gray-400 bg-gray-400/5'
    }
  }

  return (
    <div className="p-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getMetricColor('books')}`}>
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Books</p>
              <h3 className="text-2xl font-semibold text-white">{stats.overview.totalBooks}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getMetricColor('users')}`}>
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <h3 className="text-2xl font-semibold text-white">{stats.overview.activeUsers}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getMetricColor('issues')}`}>
              <ExclamationCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Issues</p>
              <h3 className="text-2xl font-semibold text-white">{stats.overview.pendingIssues}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getMetricColor('overdue')}`}>
              <ClockIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Overdue Books</p>
              <h3 className="text-2xl font-semibold text-white">{stats.overview.overdueBooks}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-medium text-white mb-4">Weekly Activity</h2>
          <div className="h-[300px]">
            <Line data={activityData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-medium text-white mb-4">Popular Categories</h2>
          <div className="h-[300px] flex items-center">
            <Doughnut data={categoryData} options={pieOptions} />
          </div>
        </motion.div>
      </div>

      {/* Daily Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-medium text-white mb-4">Today's Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.trends).map(([key, value], index) => (
              <div key={key} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  {key === 'dailyBorrows' && <BookOpenIcon className="w-5 h-5 text-blue-400" />}
                  {key === 'returns' && <DocumentCheckIcon className="w-5 h-5 text-green-400" />}
                  {key === 'newUsers' && <UserPlusIcon className="w-5 h-5 text-purple-400" />}
                  {key === 'issues' && <BellAlertIcon className="w-5 h-5 text-red-400" />}
                  <span className={`flex items-center text-sm ${getTrendColor(value.trend)}`}>
                    {value.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {value.percentage}%
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="text-2xl font-semibold text-white">{value.count}</h3>
                  <p className="text-sm text-gray-400">
                    {key === 'dailyBorrows' && 'Books Borrowed'}
                    {key === 'returns' && 'Books Returned'}
                    {key === 'newUsers' && 'New Users'}
                    {key === 'issues' && 'New Issues'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-medium text-white mb-4">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50"
              >
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">{user.registerNumber}</h3>
                  <p className="text-xs text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.program} - {user.branch}</p>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.borrowHistory[0]?.status === 'active' ? 'bg-blue-400/10 text-blue-400' :
                    user.borrowHistory[0]?.status === 'returned' ? 'bg-green-400/10 text-green-400' :
                    'bg-red-400/10 text-red-400'
                  }`}>
                    {user.borrowHistory[0]?.status || 'No borrows'}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(user.borrowHistory[0]?.borrowDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <h2 className="text-lg font-medium text-white mb-4">Active Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
            >
              <div className="flex items-center gap-3">
                <BellAlertIcon className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-300">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 